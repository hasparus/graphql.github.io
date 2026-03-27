import { Metadata } from "next"
import NextLink from "next/link"

import { NewFontsStyleTag } from "../fonts"
import "../colors.css"

import { ThemeProvider } from "next-themes"
import { EventsMap } from "./events-map"

export const metadata: Metadata = {
  title: "GraphQL Day 2026",
  description:
    "Community-organized GraphQL events at FOST conferences worldwide.",
}

const EVENTS = [
  {
    city: "Singapore",
    date: "April 14-15, 2026",
    href: "/day/2026/singapore",
    status: "confirmed" as const,
  },
  {
    city: "NYC",
    date: "May 13-14, 2026",
    href: "/day/2026/nyc",
    status: "confirmed" as const,
  },
  {
    city: "Amsterdam",
    date: "June 9-10, 2026",
    href: "/day/2026/amsterdam",
    status: "tbc" as const,
  },
  {
    city: "Melbourne",
    date: "October 28-29, 2026",
    href: "/day/2026/melbourne",
    status: "confirmed" as const,
  },
  {
    city: "Paris",
    date: "December 1-3, 2026",
    href: "/day/2026/paris",
    status: "confirmed" as const,
  },
]

export default function DayIndexPage() {
  return (
    <>
      <NewFontsStyleTag />
      <ThemeProvider attribute="class">
        <div className="bg-neu-0 text-neu-900 antialiased">
          <main className="gql-container py-12 md:py-20">
            <h1 className="typography-d1 mb-4">GraphQL Day</h1>
            <p className="typography-body-lg mb-12 max-w-2xl text-neu-700">
              Community-organized GraphQL events at FOST (Future of Software
              Technologies) conferences worldwide.
            </p>

            <EventsMap />

            <h2 className="typography-h2 mb-8 mt-16">2026 Events</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {EVENTS.map(event => (
                <NextLink
                  key={event.href}
                  href={event.href}
                  className="group flex flex-col gap-3 border border-neu-200 p-6 transition-colors hover:bg-neu-100"
                >
                  <h3 className="typography-h3 group-hover:underline">
                    {event.city}
                    {event.status === "tbc" && (
                      <span className="ml-2 text-sm font-normal text-neu-600">
                        [TBC]
                      </span>
                    )}
                  </h3>
                  <p className="typography-body-md text-neu-700">
                    {event.date}
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
