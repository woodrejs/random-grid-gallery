import React from "react";

export default function Cell({ area, src, orientation }) {
  return (
    <div
      style={{
        gridArea: area,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src={src} alt="gallery_img" style={setSize(orientation)} />
    </div>
  );
}
function setSize(orientation) {
  if (orientation === "v") {
    return {
      width: "100%",
      minHeight: "100%",
    };
  }
  if (orientation === "h") {
    return {
      minWidth: "100%",
      height: "100%",
    };
  }

  return {
    width: "100%",
    height: "100%",
  };
}
