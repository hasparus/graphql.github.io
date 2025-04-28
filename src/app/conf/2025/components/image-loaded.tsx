"use client"

import type { StaticImageData } from "next/image"
import { useEffect, useState } from "react"

export interface ImageLoadedProps extends React.HTMLAttributes<HTMLDivElement> {
  image: string | StaticImageData
}

export function ImageLoaded({ image, ...rest }: ImageLoadedProps) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    const src = typeof image === "string" ? image : image.src
    img.src = src
    img.onload = () => setLoaded(true)
  }, [image])

  return <div data-loaded={loaded} {...rest} />
}
