import Image from "next-image-export-optimizer"

import { Button } from "../../../_design-system/button"
import { CalendarIcon } from "../../pixelarticons/calendar-icon"
import { GET_TICKETS_LINK } from "../../links"
import { PinIcon } from "../../pixelarticons/pin-icon"
import graphqlFoundationWordmarkSvg from "../../assets/graphql-foundation-wordmark.svg"

import { ImageLoaded } from "../image-loaded"
import blurBean from "./blur-bean-cropped.webp"
import heroPhoto from "./hero-photo.jpeg"

export function Hero() {
  return (
    <article className="gql-conf-navbar-strip before:dark:bg-blk/40 relative isolate flex flex-col justify-center bg-pri-base text-neu-0 before:bg-white/30 dark:bg-pri-darker dark:text-neu-900">
      <article className="relative">
        <Stripes />
        <div className="gql-conf-container mx-auto flex max-w-full flex-col gap-12 overflow-hidden p-4 pt-6 sm:p-8 sm:pt-12 md:gap-12 md:bg-left md:p-12 lg:px-24 lg:pb-16 lg:pt-24">
          <div className="flex gap-10 max-md:flex-col md:justify-between">
            <h1 className="flex flex-wrap gap-2 typography-d1">
              <span>GraphQLConf</span>
              <span className="text-sec-base">2025</span>
            </h1>
            <div className="flex h-min items-center gap-4">
              <span className="whitespace-pre typography-body-sm">
                hosted by
              </span>
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
      </article>
      <div className="bg-blk">
        <Image
          src={heroPhoto}
          width={1920}
          height={560}
          alt="five speakers at GraphQLConf 2024"
          className="mx-auto h-[560px] w-[1920px] max-w-full object-cover"
        />
      </div>
    </article>
  )
}

function DateAndLocation() {
  return (
    <div className="flex flex-col gap-4 typography-body-md md:flex-row md:gap-6">
      <div className="flex items-center gap-2">
        <CalendarIcon className="size-5 sm:size-6" />
        <time dateTime="2025-09-08">September 08</time>
        <span>-</span>
        <time dateTime="2025-09-10">10, 2025</time>
      </div>
      <div className="flex items-center gap-2">
        <PinIcon className="size-5 sm:size-6" />
        <address className="not-italic">Amsterdam, Netherlands</address>
      </div>
    </div>
  )
}

const maskEven =
  "repeating-linear-gradient(to right, transparent, transparent 12px, black 12px, black 24px)"
const maskOdd =
  "repeating-linear-gradient(to right, black, black 12px, transparent 12px, transparent 24px)"

function Stripes() {
  return (
    <ImageLoaded
      role="presentation"
      image={blurBean}
      className="pointer-events-none absolute inset-x-0 bottom-[-385px] top-[-203px] -z-10 translate-y-12 opacity-0 transition duration-[400ms] ease-linear [mask-size:100%_50%] data-[loaded=true]:translate-y-0 data-[loaded=true]:opacity-100 sm:[mask-size:125%] xl:[mask-size:100%]"
      style={{
        maskImage: `url(${blurBean.src})`,
        WebkitMaskImage: `url(${blurBean.src})`,
        // maskSize: "100%", // todo: (very low priority) need the newly exported full blur bean with rotation to match the mobile design 1-1
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    >
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--color-pri-light))_0%,hsl(319deg_100%_90%_/_0.2)_100%)] dark:bg-[linear-gradient(180deg,hsl(var(--color-pri-dark))_0%,hsl(319_100%_20%_/_1)_100%)]"
        style={{
          maskImage: maskEven,
          WebkitMaskImage: maskEven,
        }}
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,hsl(319deg_100%_90%_/_0.2)_0%,hsl(var(--color-pri-base))_100%)] dark:bg-[linear-gradient(180deg,hsl(319_100%_30%_/_1)_0%,hsl(var(--color-pri-dark))_100%)]"
        style={{
          maskImage: maskOdd,
          WebkitMaskImage: maskOdd,
        }}
      />
    </ImageLoaded>
  )
}
