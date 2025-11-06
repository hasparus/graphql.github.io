// ---
// title: Events & Meetups
// ---

// # Events & Meetups

import type { ReactNode } from "react"
import type { Event } from "../../../../components/events"

import { events, EventCard } from "../../../../components/events"
import { Breadcrumbs } from "../../../../_design-system/breadcrumbs"
import { meetups } from "../../../../components/meetups"
import Link from "next/link"

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

export function EventsScrollview({ children }: { children: ReactNode }) {
  return (
    <div className="xs:nextra-scrollbar relative -mx-6 flex gap-2 overflow-auto p-6 scrollview-fade-x-16 scrollview-fade sm:-mx-1 sm:px-1 lg:gap-4">
      {children}
    </div>
  )
}

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

        <EventsScrollview>
          {meetups.map(({ node }) => (
            <EventCard
              key={node.id}
              href={node.link}
              name={node.name}
              city={node.city + ", " + node.country}
              official={node.official}
              date={node.next || node.prev}
            />
          ))}
        </EventsScrollview>
      </section>
    </div>
  )
}
