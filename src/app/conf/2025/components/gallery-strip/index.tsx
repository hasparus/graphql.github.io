"use client"

import { useState } from "react"
import { clsx } from "clsx"
import { Marquee } from "@/app/conf/_design-system/marquee"

const YEARS = ["2024", "2023", "2022"] as const
type Year = (typeof YEARS)[number]

export interface GalleryStripProps extends React.HTMLAttributes<HTMLElement> {}

export function GalleryStrip({ className, ...rest }: GalleryStripProps) {
  const [selectedYear, setSelectedYear] = useState<Year>("2024")

  return (
    <section className={clsx("py-8 md:py-16", className)} {...rest}>
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
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="md:px-2" role="presentation">
              <div className="h-[400px] w-[300px] bg-neu-500"></div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
