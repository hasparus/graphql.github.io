import { clsx } from "clsx"
import { ScheduleSession } from "@/app/conf/2023/types"
import { Tag } from "@/app/conf/_design-system/tag"
import { Button } from "@/app/conf/_design-system/button"
import { Anchor } from "@/app/conf/_design-system/anchor"
import { CalendarIcon } from "@/app/conf/_design-system/pixelarticons/calendar-icon"
import { PinIcon } from "@/app/conf/_design-system/pixelarticons/pin-icon"
import ClockIcon from "@/app/conf/_design-system/pixelarticons/clock.svg?svgr"
import PlusIcon from "@/app/conf/_design-system/pixelarticons/plus.svg?svgr"
import PlayIcon from "@/app/conf/_design-system/pixelarticons/play.svg?svgr"
import { findVideo } from "../../schedule/[id]/session-video"
import { eventsColors, getEventTitle } from "../../utils"
import React from "react"

export interface LongSessionCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  session: ScheduleSession
  eventColors?: Record<string, string>
  year?: string
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
  })
}

export function LongSessionCard({
  session,
  year = "2025",
  className,
  ...props
}: LongSessionCardProps) {
  const eventType = session.event_type.endsWith("s")
    ? session.event_type.slice(0, -1)
    : session.event_type

  const formattedDate = formatDate(session.event_start)
  const formattedTime = formatTime(session.event_start)

  const eventTitle = getEventTitle(
    session,
    session.speakers?.map(s => s.name) || [],
  )
  const video = findVideo(session, eventTitle)

  const eventDuration =
    new Date(session.event_end).getTime() -
    new Date(session.event_start).getTime()

  const speakers = session.speakers || []

  return (
    <div
      className={clsx(
        "group relative border border-neu-200 bg-neu-0 p-6",
        !!video && "flex flex-col gap-6 backdrop-blur-md",
        className,
      )}
      {...props}
    >
      <Anchor
        href={`/conf/${year}/schedule/${session.id}?name=${session.name}`}
        className="absolute inset-0 z-[1] ring-inset ring-neu-400 hover:ring-1 dark:ring-neu-100"
        aria-label={`Read more about "${eventTitle}" by ${session.speakers?.[0]?.name || "Speaker"}`}
      />

      <div className={clsx("flex flex-col gap-6", video && "mb-6")}>
        <div className="flex items-center justify-between gap-6">
          <Tag
            color={
              eventsColors[session.event_type] || "hsl(var(--color-neu-700))"
            }
          >
            {eventType}
          </Tag>
          {video && (
            <div className="flex items-center gap-2 border border-neu-400 bg-neu-100 px-2 py-1">
              <span className="typography-menu text-neu-900">
                {/* todo: find year */}
                GraphQLConf 2024
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="min-h-[120px]">
            <h3 className="typography-h3 text-neu-900">{session.name}</h3>
          </div>
          <div className="flex items-center justify-between gap-2">
            {(speakers?.length || 0) > 0 && (
              <span className="typography-body-sm">
                {speakers.map((s, i) => (
                  <React.Fragment key={s.username || s.name}>
                    {s.username ? (
                      <Anchor
                        href={`/conf/${year}/speakers/${s.username}`}
                        className="relative z-[2] decoration-neu-600 hover:underline dark:decoration-neu-200"
                      >
                        {s.name}
                      </Anchor>
                    ) : (
                      s.name
                    )}
                    {i !== speakers.length - 1 && <span>, </span>}
                  </React.Fragment>
                ))}
              </span>
            )}
            {video && (
              <div className="flex items-center gap-0.5">
                <ClockIcon className="size-3" />
                <span className="typography-body-xs text-neu-600">
                  {eventDuration}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {video ? (
        <Button
          href={`https://youtube.com/embed/${video.id}`}
          variant="primary"
          className="relative z-[2] w-full"
        >
          Watch
          <PlayIcon className="size-6" />
        </Button>
      ) : (
        <div className="flex items-center text-neu-800">
          <div className="flex flex-1 items-center gap-6 border-r border-neu-200 pr-6">
            <div className="flex items-center gap-0.5">
              <CalendarIcon className="size-4 text-sec-dark" />
              <span className="typography-body-xs">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <ClockIcon className="size-4 text-sec-dark" />
              <span className="typography-body-xs">{formattedTime}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <PinIcon className="size-4 text-sec-dark" />
              <span className="typography-body-xs">{session.venue}</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-6 pl-6">
            <button className="relative z-[2] flex items-center gap-0.5 text-neu-800">
              <PlusIcon className="size-4 text-sec-dark" />
              <span className="typography-body-xs">Add to calendar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
