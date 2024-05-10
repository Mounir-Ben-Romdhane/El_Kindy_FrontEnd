import React from "react";

function welcomeTeacher() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // Adjust to column for vertical stacking
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
        textAlign: "center", // Center align the text
      }}
    >
      <img
        src="/assets/images/welcomeTeacher.png"
        alt="No inscriptions e"
        style={{
          maxWidth: "60%", // Limit the width to 50% of its container
          maxHeight: "100%", // Limit the height to 100% of the container
          objectFit: "contain", // Ensure the image's aspect ratio is maintained
        }}
      />
    </div>
  );
}

export default welcomeTeacher;
