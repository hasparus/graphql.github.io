import { ImageResponse } from "next/og"

export const contentType = "image/png"
export const size = { width: 1200, height: 630 }

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#171717",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700 }}>GraphQL Day</div>
        <div style={{ fontSize: 36, marginTop: 16, opacity: 0.8 }}>
          Code of Conduct
        </div>
      </div>
    ),
    size,
  )
}
