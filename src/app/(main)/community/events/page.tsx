import { readFile } from "node:fs/promises"
import path from "node:path"

import { Breadcrumbs } from "@/_design-system/breadcrumbs"
import { meetups } from "@/components/meetups"
import { Button } from "@/app/conf/_design-system/button"

import { MeetupsMap } from "./meetups-map"
import { EventsList } from "./events-list"
import { events, type Event, type Meetup } from "./events"
import { BenefitsSection } from "./benefits-section"
import { GetYourMeetupNoticedSection } from "./get-your-meetup-noticed-section"
import { BringGraphQLToYourCommunity } from "./bring-graphql-to-your-community"
import type { WorkingGroupMeeting } from "../../../../../scripts/sync-working-groups/sync-working-groups"
import dynamic from "next/dynamic"

type AnyEvent = Event | Meetup | WorkingGroupMeeting

const ISSUE_TEMPLATE_LINK =
  "https://github.com/graphql/community-wg/issues/new?assignees=&labels=event&template=event-submission.yml"

const GalleryStrip = dynamic(
  () =>
    import("@/app/conf/2025/components/gallery-strip").then(
      mod => mod.GalleryStrip,
    ),
  { ssr: false },
)

const WORKING_GROUP_MEETINGS_FILE = path.join(
  process.cwd(),
  "scripts/sync-working-groups/working-group-events.ndjson",
)

export default async function EventsPage() {
  const workingGroupMeetings = await loadWorkingGroupMeetings()

  let {
    pastEvents,
    upcomingEvents,
  }: { pastEvents: AnyEvent[]; upcomingEvents: AnyEvent[] } = events.reduce(
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

  const now = new Date()

  for (const meeting of workingGroupMeetings) {
    if (meeting.start && new Date(meeting.start) < now) {
      pastEvents.push(meeting)
    } else upcomingEvents.push(meeting)
  }

  for (const meetup of meetups) {
    const { next, prev } = meetup.node
    if (next && new Date(next) < now) {
      pastEvents.push(meetup)
    } else {
      upcomingEvents.push(meetup)
      pastEvents.push({
        ...meetup,
        date: prev,
      })
    }
  }

  const getDate = (event: AnyEvent) => {
    if ("date" in event) return new Date(event.date)
    if ("node" in event) return new Date(event.node.next || event.node.prev)
    return new Date(event.start)
  }

  function sortByDate(a: AnyEvent, b: AnyEvent) {
    const aDate = getDate(a)
    const bDate = getDate(b)
    return bDate.getTime() - aDate.getTime()
  }

  pastEvents = pastEvents.sort(sortByDate)
  upcomingEvents = upcomingEvents.sort(sortByDate)

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
              className="w-fit self-end lg:row-span-2"
              href={ISSUE_TEMPLATE_LINK}
            >
              Add a new event
            </Button>
          </header>
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

async function loadWorkingGroupMeetings(): Promise<WorkingGroupMeeting[]> {
  try {
    const raw = (await readFile(WORKING_GROUP_MEETINGS_FILE, "utf8")).trim()
    if (!raw) return []
    return raw
      .split("\n")
      .filter(Boolean)
      .map(line => JSON.parse(line) as WorkingGroupMeeting)
  } catch (error) {
    console.error("Failed to read working group meetings", error)
    return []
  }
}
