import { Metadata } from "next"
import NextLink from "next/link"

import { NewFontsStyleTag } from "../fonts"
import "../colors.css"

import { ThemeProvider } from "next-themes"
import { EventsMap } from "./events-map"
import { EVENTS } from "./events-data"

export const metadata: Metadata = {
  title: "GraphQL Day 2026",
  description:
    "Community-organized GraphQL events at FOST conferences worldwide.",
}

export default function DayIndexPage() {
  return (
    <>
      <NewFontsStyleTag />
      <ThemeProvider attribute="class">
        <div className="bg-neu-0 text-neu-900 antialiased">
          <header className="relative">
            <div className="gql-container relative z-10 pb-4 pt-12 md:pt-20">
              <h1 className="typography-d1 mb-4">GraphQL Day</h1>
              <p className="typography-body-lg max-w-xl text-neu-700">
                Community-organized GraphQL events at FOST conferences
                worldwide.
              </p>
            </div>
            <div className="gql-container">
              <EventsMap />
            </div>
          </header>

          <main className="gql-container pb-12 md:pb-20">
            <h2 className="typography-h2 mb-8 mt-12">2026 Events</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {EVENTS.map(event => (
                <NextLink
                  key={event.href}
                  href={event.href}
                  className="group flex flex-col gap-3 border border-neu-200 p-6 transition-colors hover:bg-neu-100"
                >
                  <h3 className="typography-h3 group-hover:underline">
                    {event.city}
                  </h3>
                  <p className="typography-body-md text-neu-700">
                    {event.date}, 2026
                  </p>
                  <p className="typography-body-sm text-pri-base">
                    GraphQL Day @ FOST {event.city}
                  </p>
                </NextLink>
              ))}
            </div>
          </main>
        </div>
      </ThemeProvider>
    </>
  )
}
