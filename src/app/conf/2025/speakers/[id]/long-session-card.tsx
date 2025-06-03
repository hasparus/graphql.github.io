import { clsx } from "clsx"
import { ScheduleSession } from "@/app/conf/2023/types"
import { Tag } from "@/app/conf/_design-system/tag"
import { Button } from "@/app/conf/_design-system/button"
import { CalendarIcon } from "@/app/conf/_design-system/pixelarticons/calendar-icon"
import { PinIcon } from "@/app/conf/_design-system/pixelarticons/pin-icon"
import ClockIcon from "@/app/conf/_design-system/pixelarticons/clock.svg?svgr"
import PlusIcon from "@/app/conf/_design-system/pixelarticons/plus.svg?svgr"
import PlayIcon from "@/app/conf/_design-system/pixelarticons/play.svg?svgr"
import { findVideo } from "../../schedule/[id]/session-video"
import { getEventTitle } from "../../utils"

export interface LongSessionCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  session: ScheduleSession
  eventColors?: Record<string, string>
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
  eventColors = {},
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
  const hasVideo = video !== null

  if (hasVideo) {
    return (
      <div
        className={clsx(
          "border border-neu-200 bg-neu-0 p-6 shadow-sm",
          className,
        )}
        {...props}
      >
        <div className="mb-6 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-6">
            <Tag color={eventColors[session.event_type]}>{eventType}</Tag>
            <div className="flex items-center gap-2 border border-neu-400 bg-neu-100 px-2 py-1">
              <span className="typography-menu text-neu-900">
                {/* todo: find year */}
                GraphQLConf 2024
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="min-h-[120px]">
              <h3 className="typography-h3 text-neu-900">{session.name}</h3>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="typography-body-sm text-neu-600">
                {session.speakers?.[0]?.name || "Speaker"}
              </span>
              <div className="flex items-center gap-0.5">
                <ClockIcon className="size-3 text-neu-600" />
                <span className="typography-body-xs text-neu-600">25 min</span>
              </div>
            </div>
          </div>
        </div>
        <Button href="#" variant="primary" className="w-full">
          Watch
          <PlayIcon className="size-3" />
        </Button>
      </div>
    )
  }

  return (
    <div
      className={clsx(
        "flex flex-col gap-6 border border-neu-200 bg-neu-0 p-6 shadow-sm backdrop-blur-md",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-6">
          <Tag color={eventColors[session.event_type]}>{eventType}</Tag>
        </div>
        <div className="flex flex-col gap-2">
          <div className="min-h-[120px]">
            <h3 className="typography-h3 text-neu-900">{session.name}</h3>
          </div>
          <div className="flex gap-2">
            <span className="typography-body-sm text-neu-600">
              {session.speakers?.[0]?.name || "Speaker"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex flex-1 items-center gap-6 border-r border-neu-200 pr-6">
          <div className="flex items-center gap-0.5">
            <CalendarIcon className="size-3 text-sec-base" />
            <span className="typography-body-xs text-neu-600">
              {formattedDate}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <ClockIcon className="size-3 text-sec-base" />
            <span className="typography-body-xs text-neu-600">
              {formattedTime}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <PinIcon className="size-3 text-sec-base" />
            <span className="typography-body-xs text-neu-600">
              {session.venue}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-6 pl-6">
          <button className="flex items-center gap-0.5 text-neu-600 hover:text-neu-900">
            <PlusIcon className="size-3 text-sec-base" />
            <span className="typography-body-xs">Add to calendar</span>
          </button>
        </div>
      </div>
    </div>
  )
}
