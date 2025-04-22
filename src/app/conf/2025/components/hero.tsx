import { clsx } from "clsx"
import Image from "next-image-export-optimizer"
import Link from "next/link"
import { CalendarIcon } from "../pixelarticons/calendar-icon"
import { PinIcon } from "../pixelarticons/pin-icon"
import { GET_TICKETS_LINK } from "../links"
import { Button } from "../../_design-system/button"

export function Hero() {
  return (
    <section className="bg-pri-base dark:bg-pri-darker text-neu-0 dark:text-neu-900 relative flex flex-col justify-center">
      <div className="relative z-10 flex flex-col gap-12 px-4 py-24 md:gap-12 md:px-24">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="typography-d1 flex flex-wrap gap-2">
              <span>GraphQLConf</span>
              <span className="text-sec-base">2025</span>
            </h1>
            <div className="flex items-center gap-16">
              <span className="text-sm md:text-base">hosted by</span>
              <Image
                src="/assets/logo-foundation-wordmark.svg"
                alt="GraphQL Foundation"
                width={180}
                height={24}
                className="h-6 w-auto dark:invert"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <DateAndLocation />
          <Button className="w-fit" href={GET_TICKETS_LINK}>
            Get your tickets
          </Button>
        </div>
      </div>
    </section>
  )
}

function DateAndLocation() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-6">
      <div className="flex items-center gap-2">
        <CalendarIcon className="size-6" />
        <time dateTime="2025-09-08">September 08</time>
        <span>-</span>
        <time dateTime="2025-09-10">10, 2025</time>
      </div>
      <div className="flex items-center gap-2">
        <PinIcon className="size-6" />
        <address className="typography-body-md not-italic">
          Amsterdam, Netherlands
        </address>
      </div>
    </div>
  )
}
