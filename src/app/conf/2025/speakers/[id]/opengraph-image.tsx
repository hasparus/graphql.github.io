import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

import { loadFontsForOG } from "@/app/fonts/og/load-fonts-for-og"

import { speakers } from "../../_data"

export const contentType = "image/png"
export const size = {
  width: 1200,
  height: 630,
}

// This doesn't seem to work?
export function generateStaticParams() {
  // return speakers.map(s => ({ id: s.username }))
  return [{ id: "aditi_rajawat" }]
}

export default async function SpeakerOGImage({
  params,
}: {
  params: { id: string }
}) {
  const decodedId = decodeURIComponent(params.id)
  const speaker = speakers.find(s => s.username === decodedId)

  if (!speaker) {
    throw new Error(`Speaker not found: ${decodedId}`)
  }

  // TODO: The fonts need to be in .woff, not .woff2.
  const fonts = loadFontsForOG()

  return new ImageResponse(
    (
      <div className="size-full">
        <h1 className="font-mono">{params.id}</h1>
        <p className="typography-body-lg">
          {speaker?.name} is speaking at GraphQLConf 2025.
        </p>
      </div>
    ),
    {
      ...size,
      fonts: await fonts,
    },
  )
}
