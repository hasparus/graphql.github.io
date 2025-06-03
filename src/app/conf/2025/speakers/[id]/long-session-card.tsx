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
import { SessionTags } from "../../components/session-tags"

export interface LongSessionCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  session: ScheduleSession
  eventColors?: Record<string, string>
  year?: string
}

export function LongSessionCard({
  session,
  year = "2025",
  className,
  ...props
}: LongSessionCardProps) {
  const formattedDate = new Date(session.event_start).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "long",
    },
  )
  const formattedTime = new Date(session.event_start).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
  )

  const eventTitle = getEventTitle(
    session,
    session.speakers?.map(s => s.name) || [],
  )
  const video = findVideo(session, eventTitle)

  const eventDurationMs =
    new Date(session.event_end).getTime() -
    new Date(session.event_start).getTime()

  const speakers = session.speakers || []

  return (
    <div
      className={clsx(
        "group relative border border-neu-200 bg-neu-0",
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

      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between gap-6">
          <SessionTags session={session} />
          {video && (
            <div className="flex items-center gap-2 border border-neu-400 bg-neu-100 px-2 py-1">
              <span className="typography-menu text-neu-900">
                {/* todo: find year */}
                GraphQLConf 2024
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="min-h-[120px]">
            <h3 className="typography-body-lg text-neu-900">
              {getEventTitle(
                session,
                speakers.map(s => s.name),
              )}
            </h3>
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
                  {Math.round(eventDurationMs / (1000 * 60))} min
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* todo: past session no recording variant */}

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
        <footer className="flex items-center border-t border-neu-200 text-neu-800">
          <div className="flex flex-1 items-center gap-6 border-r border-neu-200 px-6 py-4">
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
          <div className="flex flex-col items-center justify-center gap-6 px-6 py-4">
            <button className="relative z-[2] flex items-center gap-0.5 text-neu-800">
              <PlusIcon className="size-4 text-sec-dark" />
              <span className="typography-body-xs">Add to calendar</span>
            </button>
          </div>
        </footer>
      )}
    </div>
  )
}
