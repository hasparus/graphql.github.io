#!/usr/bin/env node

import { writeFile } from "node:fs/promises"
import { type } from "arktype"

const CALENDAR_ID =
  "linuxfoundation.org_ik79t9uuj2p32i3r203dgv5mo8@group.calendar.google.com"
const API_KEY = process.env.GOOGLE_CALENDAR_API_KEY
const OUTPUT_FILE = new URL("./upcoming-events.ndjson", import.meta.url)
const MAX_RESULTS = 25
const DATETIME_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/

const Instant = type({
  "dateTime?": "string",
  "date?": "string",
  "timeZone?": "string",
})

const Event = type({
  id: "string",
  "status?": "string",
  "summary?": "string",
  "location?": "string",
  "description?": "string",
  start: Instant,
  end: Instant,
  htmlLink: "string",
  updated: "string",
})

const responseSchema = type({
  items: Event.array(),
})

const WorkingGroupMeetingSchema = type({
  id: "string",
  title: "string",
  "description?": "string",
  "location?": "string",
  start: Instant,
  end: Instant,
  htmlLink: "string",
  updated: "string",
  calendarId: "string",
})

type CalendarEvent = typeof Event.infer
export type WorkingGroupMeeting = typeof WorkingGroupMeetingSchema.infer

async function main() {
  if (!API_KEY) {
    console.error("GOOGLE_CALENDAR_API_KEY is not set")
    process.exit(1)
  }

  const timeMin = new Date().toISOString()
  const searchParams = new URLSearchParams({
    key: API_KEY,
    timeMin,
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: String(MAX_RESULTS),
  })

  const endpoint = new URL(
    `${encodeURIComponent(CALENDAR_ID)}/events?${searchParams}`,
    "https://www.googleapis.com/calendar/v3/calendars/",
  )

  console.log(`\nFetching events for calendar: ${CALENDAR_ID}`)
  console.log(`Filtering from: ${timeMin}`)

  const response = await fetch(endpoint)
  const body = await response.json()
  if (!response.ok) {
    const errorDetails = body.error?.message || response.statusText
    throw new Error(
      `Calendar API request failed: ${response.status} ${errorDetails}`,
    )
  }

  const payload = responseSchema.assert(body)
  const meetings = payload.items
    .filter(event => event.status !== "cancelled")
    .map(toWorkingGroupMeeting)
    .sort((a, b) => {
      const aStart = a.start.dateTime ?? a.start.date ?? ""
      const bStart = b.start.dateTime ?? b.start.date ?? ""
      return aStart.localeCompare(bStart)
    })

  const ndjson = meetings.map(event => JSON.stringify(event)).join("\n")
  const content = meetings.length > 0 ? `${ndjson}\n` : ""
  await writeFile(OUTPUT_FILE, content, "utf8")

  console.log(`Saved ${meetings.length} event(s) to ${OUTPUT_FILE.pathname}`)
}

function toWorkingGroupMeeting(event: CalendarEvent): WorkingGroupMeeting {
  return WorkingGroupMeetingSchema.assert({
    id: event.id,
    title: event.summary || "Untitled working group meeting",
    ...(event.description && { description: event.description }),
    ...(event.location && { location: event.location }),
    start: event.start,
    end: event.end,
    htmlLink: assertUrl(event.htmlLink, "event.htmlLink"),
    updated: assertDateTime(event.updated, "event.updated"),
    calendarId: CALENDAR_ID,
  })
}

function assertDateTime(value: string, label: string) {
  if (!DATETIME_REGEX.test(value)) {
    throw new Error(
      `Invalid ${label}: expected YYYY-MM-DDThh:mm:ssZ or offset, received ${value}`,
    )
  }
  return value
}

function assertUrl(value: string, label: string) {
  try {
    new URL(value)
    return value
  } catch {
    throw new Error(`Invalid ${label}: received ${value}`)
  }
}

try {
  await main()
} catch (error: unknown) {
  console.error(error)
  process.exit(1)
}
