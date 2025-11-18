import { join } from "node:path"
import { readFile } from "node:fs/promises"

import { meetups } from "@/components/meetups"

import type { WorkingGroupMeeting } from "@/../scripts/sync-working-groups/sync-working-groups"

import { events, type Event, type Meetup } from "./events"

type AnyEvent = Event | Meetup | WorkingGroupMeeting

const WORKING_GROUP_MEETINGS_FILE = join(
  process.cwd(),
  "scripts/sync-working-groups/working-group-events.ndjson",
)

export async function getAllEvents() {
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

  return { pastEvents, upcomingEvents }
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
