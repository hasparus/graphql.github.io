import { ImageResponse } from "next/og"

import { schedule } from "../../_data"

export const contentType = "image/png"
export const size = { width: 1200, height: 630 }

export function generateStaticParams() {
  return schedule.filter(s => s.id).map(s => ({ id: s.id }))
}

export default function SessionOGImage({ params }: { params: { id: string } }) {
  const decodedId = decodeURIComponent(params.id)
  const session = schedule.find(s => s.id === decodedId)

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
        <div style={{ fontSize: 32, marginTop: 16, opacity: 0.8 }}>
          {session?.name || "Session"}
        </div>
      </div>
    ),
    size,
  )
}
