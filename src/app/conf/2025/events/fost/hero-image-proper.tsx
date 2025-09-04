"use client"

import heroPhoto from "./hero-photo.webp"

if (typeof window !== "undefined") {
  const img = new Image()
  img.src = heroPhoto.src
  img.onload = () => {
    const el = document.getElementById("hero-image") as HTMLImageElement | null
    if (el) {
      el.src = heroPhoto.src
      el.style.opacity = "1"
    }
  }
}

export function HeroImageProper() {
  return (
    <img
      id="hero-image"
      suppressHydrationWarning
      className="absolute inset-0 size-full object-cover opacity-0 duration-150"
      width={heroPhoto.width}
      height={heroPhoto.height}
    />
  )
}
