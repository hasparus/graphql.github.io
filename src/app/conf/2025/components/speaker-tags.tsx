import clsx from "clsx"

import { SchedSpeaker } from "@/app/conf/2023/types"
import { Tag } from "@/app/conf/_design-system/tag"
import ReloadIcon from "@/app/conf/_design-system/pixelarticons/reload.svg?svgr"
import PlayIcon from "@/app/conf/_design-system/pixelarticons/play.svg?svgr"

import { returningSpeakers, speakerSessions } from "../_data"
import { eventsColors } from "../utils"

export function SpeakerTags({
  speaker,
  className,
}: {
  speaker: SchedSpeaker
  className?: string
}) {
  const eventType = speakerSessions.get(speaker.username)?.[0]?.event_type

  return (
    <div className={clsx("flex basis-0 flex-wrap gap-2", className)}>
      {eventType && (
        <Tag color={eventsColors[eventType] || "hsl(var(--color-sec-base))"}>
          {eventType === "Federation and Composite Schemas"
            ? "Federation"
            : eventType}
        </Tag>
      )}

      <Tag color="hsl(var(--color-neu-500))">
        {returningSpeakers.has(speaker.username) ? (
          <>
            <ReloadIcon className="-mx-0.5 size-3" />
            returning speaker
          </>
        ) : (
          <>
            <PlayIcon className="-mx-1 size-3" /> first time speaker
          </>
        )}
      </Tag>
    </div>
  )
}
