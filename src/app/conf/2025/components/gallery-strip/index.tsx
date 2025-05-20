"use client"

import { useRef, useState } from "react"
import { clsx } from "clsx"
import Image from "next-image-export-optimizer"
import type { StaticImageData } from "next/image"

import { Marquee } from "@/app/conf/_design-system/marquee"

import { imagesByYear } from "./images"

const YEARS = ["2024", "2023"] as const
type Year = (typeof YEARS)[number]

export interface GalleryStripProps extends React.HTMLAttributes<HTMLElement> {}

export function GalleryStrip({ className, ...rest }: GalleryStripProps) {
  const [selectedYear, setSelectedYear] = useState<Year>("2024")

  return (
    <section
      role="presentation"
      className={clsx("py-8 md:py-16", className)}
      {...rest}
    >
      <div className="flex gap-3.5 px-4 max-md:items-center md:px-24">
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
          className="cursor-[var(--cursor-grabbing,grab)] !overflow-visible"
        >
          {imagesByYear[selectedYear].map((image, i) => {
            const key = `${selectedYear}-${i}`

            return <GalleryStripImage key={key} image={image} index={i} />
          })}
        </Marquee>
      </div>
    </section>
  )
}

function GalleryStripImage({
  image,
  index,
}: {
  image: StaticImageData
  index: number
}) {
  return (
    <div role="presentation" className="relative md:px-2">
      <Image
        src={image}
        alt=""
        role="presentation"
        // intrinsic 799x533
        height={320}
        width={480}
        className={clsx(
          "pointer-events-none h-[320px] w-auto object-cover",
          // Alternate between 3 widths
          index % 4 === 2
            ? "w-[200px]"
            : index % 3 === 2
              ? "w-[420px]"
              : "w-[480px]",
        )}
      />
    </div>
  )
}
