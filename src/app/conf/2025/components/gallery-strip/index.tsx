"use client"

import { useState } from "react"
import { clsx } from "clsx"
import Image from "next-image-export-optimizer"
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
      <div className="flex gap-3.5 max-md:items-center md:px-24">
        {YEARS.map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={clsx(
              "p-1 typography-menu",
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
        <Marquee gap={8} speed={35} speedOnHover={15} drag reverse>
          {imagesByYear[selectedYear].map((image, i) => {
            return (
              <div
                key={`${selectedYear}-${i}`}
                className="md:px-2"
                role="presentation"
              >
                <Image
                  src={image}
                  alt=""
                  height={320}
                  className="pointer-events-none"
                />
              </div>
            )
          })}
        </Marquee>
      </div>
    </section>
  )
}
