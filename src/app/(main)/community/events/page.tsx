"use client"

import Link from "next/link"
import type { Event } from "./events"

import { events, EventCard } from "./events"
import { Breadcrumbs } from "../../../../_design-system/breadcrumbs"

import UsersIcon from "@/app/conf/_design-system/pixelarticons/users.svg?svgr"
import CommentIcon from "@/app/conf/_design-system/pixelarticons/comment.svg?svgr"
import SlidersIcon from "@/app/conf/_design-system/pixelarticons/sliders.svg?svgr"
import EyeIcon from "@/app/conf/_design-system/pixelarticons/eye.svg?svgr"

import Mailbox from "./mailbox.svg?svgr"
import { Meetups } from "./meetups"
import { BenefitCard } from "./benefit-card"
import { EventsScrollview } from "./events-scrollview"

const { pastEvents, upcomingEvents } = events.reduce(
  (acc, event) => {
    const now = new Date()
    const date = new Date(event.date)
    if (date < now) {
      acc.pastEvents.push(event)
    } else {
      acc.upcomingEvents.push(event)
    }
    return acc
  },
  { pastEvents: [], upcomingEvents: [] } as {
    pastEvents: Event[]
    upcomingEvents: Event[]
  },
)

export function Events({ events }: { events: Event[] }) {
  if (events.length === 0) return null

  return (
    <EventsScrollview>
      {events.map(event => (
        <EventCard
          key={event.slug}
          href={event.eventLink}
          date={new Date(event.date)}
          meta={event.host}
          name={event.name}
          city={event.location}
        />
      ))}
    </EventsScrollview>
  )
}

export default function EventsPage() {
  return (
    <div className="gql-container">
      <h1 className="hidden">Events & Meetups</h1>

      <div className="gql-section">
        <Breadcrumbs
          activePath={[
            {
              name: "Community",
              title: "Community",
              route: "/community",
              type: "page",
              children: [],
              frontMatter: {},
            },
            {
              name: "Events & Meetups",
              title: "Events & Meetups",
              route: "/community/events",
              type: "page",
              children: [],
              frontMatter: {},
            },
          ]}
        />
      </div>

      <section className="gql-section">
        <div className="flex flex-col gap-10 border border-sec-dark bg-sec-lighter px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:gap-16 lg:px-16">
          <div className="flex-1">
            <p className="typography-h2 text-balance text-neu-900">
              Submit your meetup
            </p>
            <div className="mt-6 space-y-4 text-neu-800">
              <p className="typography-body-lg text-balance">
                Planning to host a GraphQL meetup? The GraphQL Foundation can
                help spread the word through official channels.
              </p>
              <p className="typography-body-lg text-balance">
                To submit your event, join our{" "}
                <Link
                  href="https://discord.graphql.org"
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-neu-900/20 underline-offset-2"
                >
                  Discord
                </Link>{" "}
                and share details in the <code>#meetups-admin</code> channel.
              </p>
            </div>
            <div className="mt-8">
              <Link
                href="https://discord.graphql.org"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center bg-neu-900 px-8 py-3 text-white no-underline transition hover:bg-neu-900/90"
              >
                Go to Discord
              </Link>
            </div>
          </div>
          <div className="flex flex-1 justify-center lg:justify-end">
            <div className="flex aspect-square w-full max-w-[320px] items-center justify-center border border-sec-dark bg-sec-light p-6 text-sec-darker sm:p-8">
              <Mailbox aria-hidden className="size-full" />
            </div>
          </div>
        </div>
      </section>

      {upcomingEvents.length > 0 && (
        <section className="gql-section">
          <h2 className="typography-h2">Upcoming Events</h2>
          <Events events={upcomingEvents} />
        </section>
      )}

      <section className="gql-section">
        <h2 className="typography-h2">Past Events</h2>
        <Events events={pastEvents} />
      </section>

      <section className="gql-section">
        <h2 className="typography-h2">Meetups</h2>
        <p className="typography-body-md">
          If you are interested in hosting a GraphQL meetup, The GraphQL
          Foundation is happy to promote your GraphQL event through the{" "}
          <Link href="/community/#official-channels">
            official communication channels
          </Link>
          .
        </p>

        <p className="typography-body-md">
          Please contact us in the <code>#meetups-admin</code> channel on{" "}
          <Link href="/community/#official-channels">
            the community Discord channel
          </Link>
          .
        </p>

        <div className="mt-6 flex items-center justify-center">
          <Link
            href="/community/foundation/local-initiative"
            className="inline-flex items-center justify-center bg-primary px-6 py-3 font-semibold text-white no-underline hover:bg-primary/90"
          >
            Start a GraphQL Local!
          </Link>
        </div>

        <Meetups />
      </section>

      <BenefitsSection />
    </div>
  )
}

function BenefitsSection() {
  return (
    <section className="gql-section">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="typography-h2 text-balance">
          Benefits of getting involved
        </h2>
        <p className="typography-body-lg mt-4 text-balance text-neu-700">
          Contributing to GraphQL means more than writing code — it’s a chance
          to collaborate, share ideas, and shape the future of the ecosystem.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-16 xl:grid-cols-4">
        <BenefitCard
          icon={<UsersIcon aria-hidden className="size-10 text-sec-darker" />}
          title="Valuable networking opportunities"
          description="Engage in conversations and hands-on projects to deepen your understanding of GraphQL."
        />
        <BenefitCard
          icon={<CommentIcon aria-hidden className="size-10 text-sec-darker" />}
          title="Collaborate with others"
          description="Connect with contributors and teams building GraphQL tools and platforms."
        />
        <BenefitCard
          icon={<SlidersIcon aria-hidden className="size-10 text-sec-darker" />}
          title="Help guide the spec"
          description="Share ideas, give feedback, or participate in working groups to influence the future of GraphQL."
        />
        <BenefitCard
          icon={<EyeIcon aria-hidden className="size-10 text-sec-darker" />}
          title="Connect in real life"
          description="Put a face to the handle — meet contributors in person at events and meetups. Build lasting connections beyond the screen."
        />
      </div>
    </section>
  )
}
