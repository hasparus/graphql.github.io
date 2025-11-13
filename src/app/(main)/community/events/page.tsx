import { Breadcrumbs } from "@/_design-system/breadcrumbs"
import { meetups } from "@/components/meetups"

import { MeetupsMap } from "./meetups-map"
import { EventsList } from "./events-list"
import { events, type Event, type Meetup } from "./events"
import { BenefitsSection } from "./benefits-section"
import { GetYourMeetupNoticedSection } from "./get-your-meetup-noticed-section"
import { BringGraphQLToYourCommunity } from "./bring-graphql-to-your-community"
import dynamic from "next/dynamic"

const GalleryStrip = dynamic(
  () =>
    import("@/app/conf/2025/components/gallery-strip").then(
      mod => mod.GalleryStrip,
    ),
  { ssr: false },
)

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

const pastEventsAndMeetups: Array<Meetup | Event> = [
  ...pastEvents,
  ...meetups,
].sort((a, b) => {
  const dateA =
    "node" in a ? new Date(a.node.next || a.node.prev) : new Date(a.date)
  const dateB =
    "node" in b ? new Date(b.node.next || b.node.prev) : new Date(b.date)
  return dateB.getTime() - dateA.getTime()
})

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
          <h2 className="typography-h2">Upcoming events</h2>
          <p className="typography-body-md my-6 lg:mb-12">
            See what’s coming up across the GraphQL ecosystem.
          </p>
          <EventsList events={upcomingEvents} />
        </section>
      )}

      <BringGraphQLToYourCommunity />

      <section className="gql-section">
        <h2 className="typography-h2">Meetups</h2>
        <p className="typography-body-md mt-6">
          Find and join local GraphQL meetups happening around the world. Select
          a city to explore upcoming events.
        </p>

        <MeetupsMap />
      </section>

      <section className="gql-section">
        <h2 className="typography-h2">Past events & meetups</h2>
        <p className="typography-body-md my-6 lg:mb-12">
          A look back at how the GraphQL community connects and grows together.
        </p>
        <EventsList events={pastEventsAndMeetups} />
      </section>

      <h2 className="typography-h2 text-center">Event gallery</h2>
      <p className="typography-body-md mt-6 text-center">
        A look back at what’s been happening.
      </p>
      <GalleryStrip className="[&>:first-child]:mx-auto" />

      <BenefitsSection />
      <GetYourMeetupNoticedSection />
    </div>
  )
}
