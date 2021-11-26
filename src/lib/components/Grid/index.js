import React, { useRef, useEffect, useState } from "react";
//components
import Cell from "../Cell";

export default function Grid({ images, orientations, maxCols, gap, whitespace }) {
  const ref = useRef(null);
  const [cellsWithAreas, setCellWithAreas] = useState(null);
  const [gridHeight, setGridHeight] = useState("unset");
  const matrix = useRef(createMatrix(maxCols));
  const orientationsCounter = React.useRef(orientations);

  useEffect(() => {
    if (maxCols >= 2) {
      const areas = [];
      let row = 1;

      for (let index = 1; index < 1000; index++) {
        const { v, h, s } = orientationsCounter.current;
        if (!s && !v && !h) return setCellWithAreas(createCellsWithAreas(areas, images));

        const cellCoords = {
          currCol: index % maxCols || maxCols,
          currRow: row,
        };
        const isCellOccupied = matrix.current?.[cellCoords.currCol]?.[cellCoords.currRow];

        if (!isCellOccupied) {
          const cellSize = getCellSize(
            cellCoords,
            maxCols,
            matrix,
            orientationsCounter,
            whitespace
          );

          if (cellSize) {
            const [updatedMatrix, area] = updateMatrix(matrix, cellSize, cellCoords);
            matrix.current = updatedMatrix;
            areas.push(area);

            const updatedOrientationCounter = updateOrientationCounter(
              cellSize,
              orientationsCounter
            );
            orientationsCounter.current = updatedOrientationCounter;
          }

          if (!cellSize) {
            matrix.current[cellCoords.currCol][cellCoords.currRow] = true;
          }
        }
        cellCoords.currCol === maxCols && row++;
      }
    }
  }, [maxCols]);

  useEffect(() => {
    if (gridHeight === "unset" && ref.current) {
      const height = getGridHeight(matrix.current, maxCols, ref.current, gap);
      setGridHeight(height);
    }
  });

  if (maxCols <= 2) {
    return (
      <div
        style={{
          display: "grid",
          width: "100%",
          gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
          height: gridHeight,
          gridGap: gap,
          overflow: "hidden",
        }}
      >
        {images.map(({ key, src }) => (
          <Cell key={key} src={src} />
        ))}
      </div>
    );
  }

  if (!cellsWithAreas) return null;

  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        width: "100%",
        gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
        height: gridHeight,
        gridGap: gap,
        overflow: "hidden",
      }}
    >
      {cellsWithAreas.map(({ area, src, orientation, key }) => (
        <Cell key={key} src={src} area={area} orientation={orientation} />
      ))}
    </div>
  );
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function createMatrix(maxCols) {
  const result = {};
  for (let index = 1; index < maxCols + 2; index++) {
    result[index] = { 1: undefined };
  }
  return result;
}
function updateMatrix(matrix, cellSize, coords) {
  const matrixClone = { ...matrix.current };
  const { currCol, currRow } = coords;
  const [size, orientation] = cellSize;

  let area = null;
  let col = currCol;
  let row = currRow;

  for (let index = 0; index < size; index++) {
    if (cellSize === "4s" || cellSize === "6h" || cellSize === "2v") {
      col = currCol + (index % (size / 2));
      row = index < size / 2 ? currRow : currRow + 1;
    }

    if (cellSize === "6v" || cellSize === "2h") {
      col = index < size / 2 ? currCol : currCol + 1;
      row = currRow + (index % (size / 2));
    }

    if (index === size - 1) {
      area = `${currRow}/${currCol}/${row + 1}/${col + 1}`;
    }

    matrixClone[col][row] = true;
  }

  return [matrixClone, { area, orientation }];
}
function createCellsWithAreas(areas, images) {
  const v = [];
  const h = [];
  const s = [];

  areas.forEach(({ orientation, area }) => {
    eval(orientation).push(area);
  });

  return images.map((image) => {
    const arr = eval(image.orientation);
    const area = arr[arr.length - 1];
    arr.pop();
    return { ...image, area };
  });
}
function getCellSize(coords, maxCol, matrix, orientation, whitespace) {
  const { currCol, currRow } = coords;
  const { v, h, s } = orientation.current;
  const isLastColumn = currCol % maxCol === 0;
  const isOneBeforeLast = currCol % maxCol === 1;
  const isNextCellEmpty = matrix.current?.[currCol + 1]?.[currRow] === undefined;
  const isThirdCellEmpty = matrix.current?.[currCol + 2]?.[currRow] === undefined;
  const index = getRandomIntInclusive(0, 1);

  if (isLastColumn && v && s) return ["2v", "1s"][index];
  if (isLastColumn && v) return "2v";
  if (isLastColumn && s) return "1s";

  //horizontal
  if (h && whitespace) return isNextCellEmpty ? ["2h", null][index] : null;
  if (h && isNextCellEmpty && isThirdCellEmpty && !isOneBeforeLast)
    return ["6h", "2h"][index];
  if (h && isNextCellEmpty) return "2h";
  //vertical
  if (v && whitespace) return isNextCellEmpty ? ["2v", null][index] : "1s";
  if (v) return isNextCellEmpty ? ["6v", "2v"][index] : "2v";
  //square
  if (s && whitespace) return isNextCellEmpty ? ["1s", null][index] : "1s";
  if (s) return isNextCellEmpty ? ["1s", "4s"][index] : "1s";

  return null;
}
function updateOrientationCounter(cellSize, orientationsCounter) {
  const orientationsCounterClone = { ...orientationsCounter.current };
  orientationsCounterClone[cellSize[1]]--;
  return orientationsCounterClone;
}
function getGridHeight(matrix, maxCols, ref, gap) {
  let counter = 0;
  const width = ref.clientWidth / maxCols;

  for (const key in matrix) {
    if (Object.hasOwnProperty.call(matrix, key)) {
      const element = matrix[key];
      const size = Object.keys(element).length;

      if (size > counter) counter = size;
    }
  }

  return counter * width + gap * counter;
}
