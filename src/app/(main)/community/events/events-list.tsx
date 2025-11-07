import type { ComponentPropsWithoutRef } from "react"
import { clsx } from "clsx"

import { EventCard } from "./event-card"
import { EventsScrollview } from "./events-scrollview"
import type { Event } from "./events"

interface FilterChipProps extends ComponentPropsWithoutRef<"button"> {
  active?: boolean
  count?: number
}

export function FilterChip({
  active = false,
  children,
  className,
  count,
  disabled,
  type,
  ...props
}: FilterChipProps) {
  const showCount = typeof count === "number"

  return (
    <button
      type={type ?? "button"}
      aria-pressed={active}
      disabled={disabled}
      className={clsx(
        "gql-focus-visible typography-body-sm inline-flex h-9 items-center gap-2 border px-4 font-medium text-neu-700 transition-colors disabled:cursor-not-allowed disabled:opacity-40 dark:text-neu-200",
        active
          ? "border-neu-900 bg-neu-900 text-neu-0 dark:border-neu-0 dark:bg-neu-0 dark:text-neu-900"
          : "border-neu-200 hover:border-neu-500 dark:border-neu-100",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {showCount ? (
        <span
          className={clsx(
            "roboto-mono text-xs font-semibold",
            active ? "text-current" : "text-neu-500 dark:text-neu-400",
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  )
}

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
