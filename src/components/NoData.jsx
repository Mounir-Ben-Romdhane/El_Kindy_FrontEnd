import React from 'react'

function NoData() {
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
                      src="/assets/images/no_data.png"
                      alt="No inscriptions available"
                      style={{
                        maxWidth: "60%", // Limit the width to 50% of its container
                        maxHeight: "100%", // Limit the height to 100% of the container
                        objectFit: "contain", // Ensure the image's aspect ratio is maintained
                      }}
                    />
                    <h3
                      style={{
                        marginTop: "20px",
                        fontSize: "1.5rem",
                        color: "#666",
                      }}
                    >
                      There is no data found.
                    </h3>
                  </div>
  )
}

export default NoData