import { Metadata } from "next"
import NextLink from "next/link"

import {
  asRgbString,
  MAP_COLORS,
} from "@/app/(main)/community/events/map/map-colors"

import { EventsMap } from "./events-map"
import { EVENTS } from "./events-data"
import { PastSpeakersSection } from "./2026/components/past-speakers"

export const metadata: Metadata = {
  title: "GraphQL Day 2026",
  description:
    "Community-organized GraphQL events at FOST conferences worldwide.",
}

export default function DayIndexPage() {
  return (
    <>
      <header
        className="relative bg-[--sea] [--sea:--sea-light] dark:[--sea:--sea-dark]"
        style={
          {
            "--sea-dark": asRgbString(MAP_COLORS.dark.sea),
            "--sea-light": asRgbString(MAP_COLORS.light.sea),
          } as React.CSSProperties
        }
      >
        {/* Mobile: map full width, text overlaid */}
        {/* Desktop: map right-aligned at 75%, text on left */}
        <div className="relative lg:ml-auto lg:w-3/4">
          <EventsMap />
          {/* Gradient fade — bottom-up on mobile, left-to-right on desktop */}
          {/* eslint-disable-next-line tailwindcss/no-contradicting-classname */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[--sea] via-[hsl(var(--sea)/0.6)] via-40% to-transparent lg:bg-gradient-to-r lg:from-[--sea] lg:via-[hsl(var(--sea)/0.4)] lg:via-30% lg:to-transparent" />
        </div>
        <div className="gql-container pointer-events-none absolute inset-0 z-20 flex flex-col justify-end px-4 lg:justify-center lg:px-12 xl:px-24">
          <div className="pointer-events-auto pb-8 pt-20 md:pb-12 lg:max-w-md lg:py-0 xl:max-w-2xl">
            <h1 className="typography-d1 mb-4 text-neu-900">GraphQL Day</h1>
            <p className="typography-body-lg text-neu-700 dark:text-neu-200">
              Community-organized GraphQL events at FOST conferences worldwide.
            </p>
          </div>
        </div>
      </header>

      <main className="gql-container px-4 pb-12 md:pb-20 lg:px-12 xl:px-24">
        <h2 className="typography-h2 mb-8 mt-6 md:mt-12">2026 Events</h2>
        <div className="flex flex-col gap-4">
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

        <PastSpeakersSection />
      </main>
    </>
  )
}
