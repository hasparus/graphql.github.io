import { clsx } from "clsx"
import Image from "next-image-export-optimizer"
import { CalendarIcon } from "../../pixelarticons/calendar-icon"
import { PinIcon } from "../../pixelarticons/pin-icon"
import { GET_TICKETS_LINK } from "../../links"
import { Button } from "../../../_design-system/button"
import linesPng from "./lines.png"
import graphqlFoundationWordmarkSvg from "../../assets/graphql-foundation-wordmark.svg"

export function Hero() {
  return (
    <section className="bg-pri-base dark:bg-pri-darker text-neu-0 dark:text-neu-900 isolate flex flex-col justify-center">
      <div className="relative flex flex-col gap-12 p-4 pt-6 md:gap-12 md:bg-left md:px-24 xl:pb-16 xl:pt-24">
        <div
          className="pointer-events-none absolute inset-0 max-md:rotate-180 md:bg-left"
          style={{
            // todo: consider recreating this in CSS, so we can animate
            backgroundImage: `url(${linesPng.src})`,
            backgroundSize: "cover",
          }}
        />
        <div className="z-10 flex gap-10 max-md:flex-col md:justify-between">
          <h1 className="typography-d1 flex flex-wrap gap-2">
            <span>GraphQLConf</span>
            <span className="text-sec-base">2025</span>
          </h1>
          <div className="flex h-min items-center gap-4">
            <span className="typography-body-sm whitespace-pre">hosted by</span>
            <img
              src={graphqlFoundationWordmarkSvg.src}
              alt="GraphQL Foundation"
              width={128}
              height={34.877}
            />
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <DateAndLocation />
          <Button className="md:w-fit" href={GET_TICKETS_LINK}>
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
