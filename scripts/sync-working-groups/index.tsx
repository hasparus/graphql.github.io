import { writeFile } from "fs/promises"

/**
 * https://calendar.google.com/calendar/u/0/embed?src=linuxfoundation.org_ik79t9uuj2p32i3r203dgv5mo8@group.calendar.google.com
 */
const CALENDAR_ID =
  "linuxfoundation.org_ik79t9uuj2p32i3r203dgv5mo8@group.calendar.google.com"
const API_KEY = process.env.GOOGLE_CALENDAR_API_KEY
const OUTPUT_FILE = "upcoming_events.json"

interface CalendarEvent {
  summary: string
  location?: string
  description?: string
  start: {
    dateTime?: string // For timed events
    date?: string // For all-day events
  }
  end: {
    dateTime?: string
    date?: string
  }
  htmlLink: string
}

interface EventsListResponse {
  items: CalendarEvent[]
}

async function fetchCalendarEvents() {
  if (!API_KEY) {
    console.error(
      "Error: GOOGLE_CALENDAR_API_KEY environment variable not set.",
    )
    process.exit(1)
  }

  const timeMin = new Date().toISOString()

  const apiUrl =
    "https://www.googleapis.com/calendar/v3/calendars/" +
    `${CALENDAR_ID}/events?key=${API_KEY}` +
    `&timeMin=${timeMin}` +
    "&singleEvents=true" +
    "&orderBy=startTime" +
    "&maxResults=20" // Fetch up to 20 upcoming events

  console.log(`\nFetching events for Calendar ID: ${CALENDAR_ID}`)
  console.log(`Filtering from: ${timeMin}\n`)

  try {
    const response = await fetch(apiUrl)

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      const errorMessage = errorBody.error?.message || response.statusText
      throw new Error(
        `API Request Failed: ${response.status} - ${errorMessage}`,
      )
    }

    const data: EventsListResponse = await response.json()

    if (data.items.length === 0) {
      console.log("No upcoming events found.")
      return
    }

    const jsonContent = JSON.stringify(data.items, null, 2)
    await writeFile(OUTPUT_FILE, jsonContent, "utf-8")

    console.log(`Successfully fetched ${data.items.length} events.`)
    console.log(`Data saved to ${OUTPUT_FILE}`)
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `\nAn error occurred while fetching the calendar: ${error.message}`,
      )
    } else {
      console.error("\nAn unknown error occurred.", error)
    }
  }
}

fetchCalendarEvents()
