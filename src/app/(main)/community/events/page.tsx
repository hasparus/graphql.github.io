import dynamic from "next/dynamic"

import { Breadcrumbs } from "@/_design-system/breadcrumbs"
import { Button } from "@/app/conf/_design-system/button"

import { MeetupsMap } from "./meetups-map"
import { EventsList } from "./events-list"
import { BenefitsSection } from "./benefits-section"
import { GetYourMeetupNoticedSection } from "./get-your-meetup-noticed-section"
import { BringGraphQLToYourCommunity } from "./bring-graphql-to-your-community"
import { getAllEvents } from "./get-all-events"
import { SubscribeToRssLink } from "./subscribe-to-rss-link"

const ISSUE_TEMPLATE_LINK =
  "https://github.com/graphql/community-wg/issues/new?assignees=&labels=event&template=event-submission.yml"

const GalleryStrip = dynamic(
  () =>
    import("@/app/conf/2025/components/gallery-strip").then(
      mod => mod.GalleryStrip,
    ),
  { ssr: false },
)

export default async function EventsPage() {
  const { upcomingEvents, pastEvents } = await getAllEvents()

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
          <header className="mb-6 flex w-full gap-4 max-md:flex-col lg:mb-12 lg:gap-6">
            <div className="flex-1">
              <h2 className="typography-h2">Upcoming events</h2>
              <p className="typography-body-md col-start-1 mt-4 lg:mt-6">
                See what’s coming up across the GraphQL ecosystem.
              </p>
            </div>
            <Button
              className="w-fit self-end max-md:hidden lg:row-span-2"
              href={ISSUE_TEMPLATE_LINK}
            >
              Add a new event
            </Button>
          </header>
          <EventsList events={upcomingEvents}>
            <SubscribeToRssLink />
          </EventsList>
          <Button className="md:hidden" href={ISSUE_TEMPLATE_LINK}>
            Add a new event
          </Button>
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
        <EventsList events={pastEvents} />
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
