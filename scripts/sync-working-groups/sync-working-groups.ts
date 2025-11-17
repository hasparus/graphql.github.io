#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises"
import { type } from "arktype"

const CALENDAR_ID =
  "linuxfoundation.org_ik79t9uuj2p32i3r203dgv5mo8@group.calendar.google.com"
const API_KEY = process.env.GOOGLE_CALENDAR_API_KEY
const OUTPUT_FILE = new URL("./working-group-events.ndjson", import.meta.url)
const DAYS_BACK = 30
const DAYS_TO_KEEP = 90
const DAYS_AHEAD = 30
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
  "nextSyncToken?": "string",
  "nextPageToken?": "string",
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

  const now = new Date()
  const existingMeetings = await readExistingMeetings()
  console.log(`Found ${existingMeetings.length} existing event(s) in file`)

  const lastMeeting = existingMeetings.at(-1)
  const lastMeetingStart =
    lastMeeting?.start.dateTime ??
    (lastMeeting?.start.date ? `${lastMeeting.start.date}T00:00:00Z` : null)
  const cutoffDate = new Date(
    now.getTime() - DAYS_TO_KEEP * 24 * 60 * 60 * 1000,
  )

  const searchParams = new URLSearchParams({
    key: API_KEY,
    singleEvents: "true",
  })

  const timeMin =
    lastMeetingStart !== null && lastMeetingStart !== undefined
      ? new Date(Math.min(Date.parse(lastMeetingStart) + 1, now.getTime()))
      : new Date(now.getTime() - DAYS_BACK * 24 * 60 * 60 * 1000)

  const timeMax = new Date(now.getTime() + DAYS_AHEAD * 24 * 60 * 60 * 1000)
  searchParams.set("timeMin", timeMin.toISOString())
  searchParams.set("timeMax", timeMax.toISOString())
  searchParams.set("orderBy", "startTime")
  console.log(
    `\nSyncing from: ${timeMin.toLocaleDateString()} (${timeMin.toISOString()})`,
  )
  console.log(
    `Limiting to before: ${timeMax.toLocaleDateString()} (${timeMax.toISOString()})`,
  )

  const endpoint = new URL(
    `calendars/${encodeURIComponent(CALENDAR_ID)}/events?${searchParams}`,
    "https://www.googleapis.com/calendar/v3/",
  )

  console.log(`Fetching events for calendar: ${CALENDAR_ID}`)

  const response = await fetch(endpoint)
  const body = await response.json()

  if (!response.ok) {
    const errorDetails = body.error?.message || response.statusText
    throw new Error(
      `Calendar API request failed: ${response.status} ${errorDetails}`,
    )
  }

  const payload = responseSchema.assert(body)

  let allNewMeetings = payload.items
    .filter(event => event.status !== "cancelled")
    .map(toWorkingGroupMeeting)

  if (payload.nextPageToken) {
    let pageToken: string | undefined = payload.nextPageToken
    while (pageToken) {
      const pageParams = new URLSearchParams(searchParams)
      pageParams.set("pageToken", pageToken)
      const pageEndpoint = new URL(
        `${encodeURIComponent(CALENDAR_ID)}/events?${pageParams}`,
        "https://www.googleapis.com/calendar/v3/calendars/",
      )
      const pageResponse = await fetch(pageEndpoint)
      const pageBody = await pageResponse.json()
      if (!pageResponse.ok) {
        throw new Error(`Page fetch failed: ${pageResponse.status}`)
      }
      const pagePayload = responseSchema.assert(pageBody)
      allNewMeetings = [
        ...allNewMeetings,
        ...pagePayload.items
          .filter(event => event.status !== "cancelled")
          .map(toWorkingGroupMeeting),
      ]
      pageToken = pagePayload.nextPageToken
    }
  }

  const newMeetings = allNewMeetings
  const newIds = new Set(newMeetings.map(meeting => meeting.id))
  const existingIds = new Set(existingMeetings.map(meeting => meeting.id))
  const newCount = Array.from(newIds).filter(id => !existingIds.has(id)).length
  console.log(
    `Fetched ${newMeetings.length} event(s) from API (${newCount} new)`,
  )

  const allMeetings = mergeMeetings(existingMeetings, newMeetings)
  const netChange = allMeetings.length - existingMeetings.length

  if (netChange > 0) {
    console.log(`Added ${netChange} new event(s)`)
  } else if (netChange < 0) {
    console.log(`Removed ${Math.abs(netChange)} event(s)`)
  }
  const cutoffDateStr = cutoffDate.toISOString().split("T")[0]
  const futureLimit = new Date(now.getTime() + DAYS_AHEAD * 24 * 60 * 60 * 1000)
  const futureLimitStr = futureLimit.toISOString().split("T")[0]
  const filteredMeetings = allMeetings.filter(meeting => {
    const start = meeting.start.dateTime ?? meeting.start.date ?? ""
    const startDate = start.split("T")[0]
    return startDate >= cutoffDateStr && startDate <= futureLimitStr
  })

  console.log(
    `Keeping events from ${cutoffDate.toLocaleDateString()} onwards (${DAYS_TO_KEEP} days)`,
  )
  console.log(
    `Filtered to ${filteredMeetings.length} event(s) after removing old entries`,
  )

  const sortedMeetings = filteredMeetings.sort((a, b) => {
    const aStart = a.start.dateTime ?? a.start.date ?? ""
    const bStart = b.start.dateTime ?? b.start.date ?? ""
    return aStart.localeCompare(bStart)
  })

  const ndjson = sortedMeetings.map(event => JSON.stringify(event)).join("\n")
  const content = sortedMeetings.length > 0 ? `${ndjson}\n` : ""
  await writeFile(OUTPUT_FILE, content, "utf8")

  console.log(
    `Saved ${sortedMeetings.length} event(s) to ${OUTPUT_FILE.pathname}`,
  )
}

async function readExistingMeetings(): Promise<WorkingGroupMeeting[]> {
  try {
    const content = await readFile(OUTPUT_FILE, "utf8")
    return content
      .trim()
      .split("\n")
      .filter(line => line.trim())
      .map(line => WorkingGroupMeetingSchema.assert(JSON.parse(line)))
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return []
    }
    throw error
  }
}

function mergeMeetings(
  existing: WorkingGroupMeeting[],
  incoming: WorkingGroupMeeting[],
): WorkingGroupMeeting[] {
  const byId = new Map<string, WorkingGroupMeeting>()

  for (const meeting of existing) {
    byId.set(meeting.id, meeting)
  }

  for (const meeting of incoming) {
    const existing = byId.get(meeting.id)
    if (!existing || meeting.updated > existing.updated) {
      byId.set(meeting.id, meeting)
    }
  }

  return Array.from(byId.values())
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
