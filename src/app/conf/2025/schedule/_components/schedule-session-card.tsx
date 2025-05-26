import { getEventTitle } from "@/app/conf/2023/utils"
import { SchedSpeaker } from "@/app/conf/2023/types"

import { PinIcon } from "../../pixelarticons/pin-icon"
import { Tag } from "@/app/conf/_design-system/tag"

import { type ScheduleSession } from "./session-list"

function isString(x: any) {
  return Object.prototype.toString.call(x) === "[object String]"
}

export function ScheduleSessionCard({
  session,
  showEventType,
  year,
  eventsColors,
}: {
  session: ScheduleSession
  showEventType: boolean | undefined
  year: "2025" | "2024"
  eventsColors: Record<string, string>
}) {
  const eventType = session.event_type.endsWith("s")
    ? session.event_type.slice(0, -1)
    : session.event_type

  const speakers = session.speakers
  const formattedSpeakers = isString(speakers || [])
    ? (speakers as string)?.split(",")
    : (speakers as SchedSpeaker[])?.map(e => e.name)

  const eventTitle = getEventTitle(
    // @ts-expect-error fixme
    session,
    formattedSpeakers,
  )

  const eventColor = eventsColors[session.event_type]

  return session.event_type === "Breaks" ? (
    <div className="flex size-full items-center bg-neu-0 px-4 py-2 font-normal">
      {showEventType ? eventType + " / " : ""}
      {eventTitle}
    </div>
  ) : (
    <a
      id={`session-${session.id}`}
      data-tooltip-id="my-tooltip"
      href={`/conf/${year}/schedule/${session.id}?name=${session.name}`}
      className="group relative size-full bg-neu-0 p-4 font-normal no-underline ring-neu-400 hover:bg-neu-0/90 hover:ring-1 focus-visible:z-[1] dark:ring-neu-100 dark:hover:bg-neu-0/80 max-lg:mt-px"
    >
      <span className="flex h-full flex-col justify-start">
        {eventColor && (
          <Tag className="mb-3" color={eventColor}>
            {eventType}
          </Tag>
        )}
        <span className="flex h-full flex-col justify-between gap-y-2">
          {showEventType ? eventType + " / " : ""}
          <span className="typography-body-md">{eventTitle}</span>
          <span className="flex flex-col">
            {(speakers?.length || 0) > 0 && (
              <span className="typography-body-sm">
                {/* todo: link to speakers (anchor background on z-index above the main link layer) */}
                {formattedSpeakers.join(", ")}
              </span>
            )}
            <span className="mt-2 flex items-center gap-0.5 typography-body-xs">
              <PinIcon className="size-4 text-pri-base" />
              {session.venue}
            </span>
          </span>
        </span>
      </span>
    </a>
  )
}
