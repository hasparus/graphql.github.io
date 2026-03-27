import { Metadata } from "next"
import NextLink from "next/link"

import {
  asRgbString,
  MAP_COLORS,
} from "@/app/(main)/community/events/map/map-colors"

import { EventsMap } from "./events-map"
import { EVENTS } from "./events-data"
import { PastSpeakersSection } from "./2026/components/past-speakers"
import { NavbarPlaceholder } from "./2026/components/navbar"
import fostLogo from "./2026/assets/fost-logo.svg"
import Image from "next/image"

export const metadata: Metadata = {
  title: "GraphQL Day 2026",
  description:
    "Community-organized GraphQL events at FOST conferences worldwide.",
}

export default function DayIndexPage() {
  return (
    <>
      <NavbarPlaceholder className="top-0 bg-[#FBFCF4] before:bg-[#FBFCF4]/30 dark:bg-[#181A12] dark:before:bg-blk/40" />
      <header
        className="bg-[--sea] [--sea:--sea-light] dark:[--sea:--sea-dark]"
        style={
          {
            "--sea-dark": asRgbString(MAP_COLORS.dark.sea),
            "--sea-light": asRgbString(MAP_COLORS.light.sea),
          } as React.CSSProperties
        }
      >
        <div className="gql-container relative isolate">
          <EventsMap>
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[--sea] to-transparent lg:bg-gradient-to-r lg:from-[--sea] lg:to-transparent lg:to-40%" />
          </EventsMap>
          <div className="gql-container pointer-events-none absolute inset-0 z-20 flex flex-col justify-end px-4 lg:justify-center lg:px-12 xl:px-24">
            <div className="pointer-events-auto pb-8 pt-20 md:pb-12 lg:max-w-md lg:py-0 xl:max-w-2xl">
              <h1 className="typography-d1 mb-4 text-neu-900">GraphQL Day</h1>
              <p className="typography-body-lg text-neu-700 dark:text-neu-400">
                Community-organized GraphQL events at FOST conferences
                worldwide.
              </p>
              <a
                href="https://www.joinfost.io"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8"
              >
                <Image src={fostLogo.src} alt="FOST" width={120} height={40} />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="gql-container gql-section">
        <h2 className="typography-h2 my-6 md:mt-12">GraphQL Days in 2026</h2>
        <p className="typography-body-md text-neu-700 dark:text-neu-400">
          Started in Paris. Now in{" "}
          {Intl.NumberFormat("en-US").format(EVENTS.length)} cities worldwide.
          Whether you're deep in production or just getting started, this is
          your chance to connect, share best practices, and see what's new.
        </p>
        <div className="mt-8 flex flex-col gap-4">
          {EVENTS.map(event => (
            <NextLink
              key={event.href}
              href={event.href}
              className="group flex items-center justify-between gap-6 border border-neu-200 p-6 hover:bg-neu-100 md:p-8"
            >
              <div className="flex flex-col gap-2">
                <h3 className="typography-h2 group-hover:underline">
                  {event.city}
                </h3>
                <p className="typography-body-md text-neu-700">
                  {event.date}, 2026
                </p>
              </div>
              <span className="typography-body-md hidden text-pri-base sm:block">
                GraphQL Day @ FOST {event.city}
              </span>
            </NextLink>
          ))}
        </div>
      </main>

      <PastSpeakersSection />
    </>
  )
}
