import { clsx } from "clsx"
import Image from "next-image-export-optimizer"
import { CalendarIcon } from "../../pixelarticons/calendar-icon"
import { PinIcon } from "../../pixelarticons/pin-icon"
import { GET_TICKETS_LINK } from "../../links"
import { Button } from "../../../_design-system/button"
import graphqlFoundationWordmarkSvg from "../../assets/graphql-foundation-wordmark.svg"
import heroPhoto from "./hero-photo.jpeg"
import blurBean from "./blur-bean-cropped.webp"

// - the background is made of even and odd stripes every 12px and a mask
// - i can have two divs with repeating background image and a mask

export function Hero() {
  return (
    <section className="isolate flex flex-col justify-center bg-pri-base text-neu-0 dark:bg-pri-darker dark:text-neu-900">
      <div className="relative mx-auto flex w-[90rem] max-w-full flex-col gap-12 overflow-hidden p-4 pt-6 md:gap-12 md:bg-left md:px-24 xl:pb-16 xl:pt-24">
        <Stripes />
        <div className="flex gap-10 max-md:flex-col md:justify-between">
          <h1 className="flex flex-wrap gap-2 typography-d1">
            <span>GraphQLConf</span>
            <span className="text-sec-base">2025</span>
          </h1>
          <div className="flex h-min items-center gap-4">
            <span className="whitespace-pre typography-body-sm">hosted by</span>
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
      <div className="bg-[#000]">
        <Image
          src={heroPhoto}
          width={1920}
          height={560}
          alt="five speakers at GraphQLConf 2024"
          className="mx-auto h-[560px] w-[1920px] max-w-full object-cover"
        />
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
        <address className="not-italic typography-body-md">
          Amsterdam, Netherlands
        </address>
      </div>
    </div>
  )
}

function Stripes() {
  const maskEven =
    "repeating-linear-gradient(to right, transparent, transparent 12px, black 12px, black 24px)"
  const maskOdd =
    "repeating-linear-gradient(to right, black, black 12px, transparent 12px, transparent 24px)"

  // TODO: dark mode:
  // background: linear-gradient(180deg, var(--Primary-Dark, #990069) 0%, #660046 100%);
  // ^ the same one as with base
  // background: linear-gradient(180deg, #990069 0%, var(--Primary-Dark, #990069) 100%);
  // ^ the same one as with light

  return (
    <div
      role="presentation"
      className="pointer-events-none absolute inset-x-0 bottom-[-385px] top-[-203px] -z-10"
      // todo: animate opacity up after the image is loaded
      style={{
        maskImage: `url(${blurBean.src})`,
        WebkitMaskImage: `url(${blurBean.src})`,
        maskSize: "100%",
        WebkitMaskSize: "100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--color-pri-light)) 0%, hsl(319deg, 100%, 90%, 0.4) 100%)",
          maskImage: maskEven,
          WebkitMaskImage: maskEven,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(319deg, 100%, 90%, 0.2) 0%, hsl(var(--color-pri-base)) 100%)",
          maskImage: maskOdd,
          WebkitMaskImage: maskOdd,
        }}
      />
    </div>
  )
}
