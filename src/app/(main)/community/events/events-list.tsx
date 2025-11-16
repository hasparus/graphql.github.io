"use client"

import { useState, type ComponentPropsWithoutRef } from "react"
import { clsx } from "clsx"

import { EventCard } from "./event-card"
import { EventsScrollview } from "./events-scrollview"
import type { Event, Meetup } from "./events"
import { EventFilterTag, EventKind } from "./event-filter-tag"

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

const ALL_SHOWN = {
  meetup: true,
  conference: true,
  "working-group": true,
} satisfies Record<EventKind, boolean>

export function EventsList({
  events,
  className,
}: {
  events: Array<Event | Meetup>
  className?: string
}) {
  const [kindFilters, setKindFilters] = useState(ALL_SHOWN)

  if (events.length === 0) return null

  const tags: Set<EventKind> = new Set()
  events.forEach(event => {
    // todo: add working groups
    if ("node" in event) tags.add("meetup")
    else tags.add("conference")
  })

  return (
    <div className={className}>
      {tags.size > 1 && events.length > 4 ? (
        <fieldset className="mb-8">
          <legend className="typography-menu mt-2">Event type</legend>
          <div className="mt-4 flex gap-3">
            {Array.from(tags).map(tag => (
              <EventFilterTag
                key={tag}
                kind={tag}
                checked={kindFilters[tag]}
                onChange={event => {
                  setKindFilters(prev => ({
                    ...prev,
                    [tag]: event.target.checked,
                  }))
                }}
              />
            ))}
          </div>
        </fieldset>
      ) : null}
      <EventsScrollview>
        {events
          .filter(event => {
            if ("node" in event) return kindFilters["meetup"]
            else return kindFilters["conference"]
          })
          .map(event =>
            "node" in event ? (
              <EventCard
                key={event.node.id}
                name={event.node.name}
                href={event.node.link}
                city={event.node.city + ", " + event.node.country}
                official={event.node.official}
                date={event.node.next || event.node.prev}
                kind="meetup"
              />
            ) : (
              <EventCard
                key={event.slug}
                href={event.eventLink}
                date={new Date(event.date)}
                meta={event.host}
                name={event.name}
                city={event.location}
                kind="conference"
              />
            ),
          )}
      </EventsScrollview>
    </div>
  )
}
