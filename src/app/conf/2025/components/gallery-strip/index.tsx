"use client"

import { useRef, useState } from "react"
import { motion, useMotionTemplate, useSpring } from "motion/react"
import { clsx } from "clsx"
import Image from "next-image-export-optimizer"
import type { StaticImageData } from "next/image"

import { Marquee } from "@/app/conf/_design-system/marquee"
import ZoomInIcon from "../../pixelarticons/zoom-in.svg?svgr"
import ZoomOutIcon from "../../pixelarticons/zoom-out.svg?svgr"

import { imagesByYear } from "./images"

const YEARS = ["2024", "2023"] as const
type Year = (typeof YEARS)[number]

export interface GalleryStripProps extends React.HTMLAttributes<HTMLElement> {}

export function GalleryStrip({ className, ...rest }: GalleryStripProps) {
  const [selectedYear, setSelectedYear] = useState<Year>("2024")

  const previousZoomedImage = useRef<HTMLElement | null>(null)

  return (
    <section
      role="presentation"
      className={clsx("py-8 md:py-16", className)}
      {...rest}
    >
      <div className="flex gap-3.5 max-md:items-center md:px-24">
        {YEARS.map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={clsx(
              "gql-focus-visible p-1 typography-menu",
              selectedYear === year
                ? "bg-sec-light text-neu-900 dark:text-neu-0"
                : "text-neu-800",
            )}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="mt-6 w-full md:mt-10">
        <Marquee
          gap={8}
          speed={35}
          speedOnHover={15}
          drag
          reverse
          className="!overflow-visible"
        >
          {imagesByYear[selectedYear].map((image, i) => {
            const key = `${selectedYear}-${i}`

            return (
              <GalleryStripImage
                key={key}
                image={image}
                previousZoomedImage={previousZoomedImage}
              />
            )
          })}
        </Marquee>
      </div>
    </section>
  )
}

function GalleryStripImage({
  image,
  previousZoomedImage,
}: {
  image: StaticImageData
  previousZoomedImage: React.MutableRefObject<HTMLElement | null>
}) {
  const [isZoomed, setIsZoomed] = useState(false)
  const scale = useSpring(1)
  const transform = useMotionTemplate`translate3d(0,0,var(--translate-z,-16px)) scale(${scale})`

  // if we set scale in useEffect the UI glitches
  const zoomIn = (current: HTMLElement | null) => {
    if (previousZoomedImage.current) {
      previousZoomedImage.current.style.zIndex = "0"
      previousZoomedImage.current.style.setProperty("--translate-z", "0px")
    }

    if (current) {
      current.style.zIndex = "2"
      current.style.setProperty("--translate-z", "16px")
    }

    previousZoomedImage.current = current

    scale.set(1.665625)
    setIsZoomed(true)
  }

  const zoomOut = () => {
    scale.set(1)
    setIsZoomed(false)
  }

  return (
    <motion.div
      role="presentation"
      className="relative md:px-2"
      style={{ transform }}
      onPointerOut={event => {
        const target = event.currentTarget
        const relatedTarget = event.relatedTarget as Node | null

        if (!relatedTarget || !target.contains(relatedTarget)) {
          zoomOut()
        }
      }}
    >
      <Image
        src={image}
        alt=""
        role="presentation"
        width={799}
        height={533}
        className="pointer-events-none aspect-[799/533] h-[320px] w-auto object-cover"
      />
      <button
        type="button"
        className="absolute right-2 top-0 z-[1] bg-neu-50/10 p-4"
        onClick={event => {
          isZoomed ? zoomOut() : zoomIn(event.currentTarget.parentElement)
        }}
      >
        {isZoomed ? (
          <ZoomOutIcon className="size-12" />
        ) : (
          <ZoomInIcon className="size-12" />
        )}
      </button>
    </motion.div>
  )
}
