import { EventCard } from "./event-card"
import { EventsScrollview } from "./events-scrollview"
import type { Event } from "./events"

export function EventsList({ events }: { events: Event[] }) {
  if (events.length === 0) return null

  // TODO: Filters over kind (meetup, conference, working-group)
  // Show filters only for events already in the list
  // Show filters only if there are more than 3 events
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
