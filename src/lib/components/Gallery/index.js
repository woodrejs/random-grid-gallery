import React, { useState, useEffect } from "react";
//components
import Grid from "../Grid";
//utils
import { v4 as uuidv4 } from "uuid";

export default function Gallery({
  photos = [],
  maxCols = 5,
  gap = 10,
  whitespace = false,
  className,
}) {
  //hooks
  const [imagesWithOrientations, setImagesWithOrientations] = useState(null);
  const [orientations, setOrientations] = useState(null);

  //effects
  useEffect(() => {
    async function init() {
      const [images, orientationsCounter] = await getImagesWithOrientations(photos);

      setImagesWithOrientations(images);
      setOrientations(orientationsCounter);
    }

    init();
  }, [photos]);

  if (!imagesWithOrientations || !orientations) return null;

  return (
    <div className={className}>
      <Grid
        images={imagesWithOrientations}
        orientations={orientations}
        maxCols={maxCols}
        gap={gap}
        whitespace={whitespace}
      />
    </div>
  );
}
//functions
async function getImagesWithOrientations(images) {
  const horizontal = [];
  const vertical = [];
  const square = [];

  await Promise.all(
    images.map(async (src) => {
      return await new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener("load", () => {
          const { height, width } = img;

          if (height > width) {
            vertical.push({ src, key: uuidv4(), orientation: "v" });
          }
          if (width > height) {
            horizontal.push({ src, key: uuidv4(), orientation: "h" });
          }
          if (height === width) {
            square.push({ src, key: uuidv4(), orientation: "s" });
          }

          resolve(true);
        });
        img.addEventListener("error", (err) => reject(err));
        img.src = src;
      });
    })
  );

  const imagesWithOrientations = horizontal.concat(vertical, square);

  return [
    imagesWithOrientations,
    { s: square.length, v: vertical.length, h: horizontal.length },
  ];
}
