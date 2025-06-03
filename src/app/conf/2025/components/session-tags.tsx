import { ScheduleSession } from "@/app/conf/2023/types"
import { Tag } from "@/app/conf/_design-system/tag"
import React from "react"

import { eventsColors } from "../utils"

export function SessionTags({ session }: { session: ScheduleSession }) {
  const eventType = session.event_type.endsWith("s")
    ? session.event_type.slice(0, -1)
    : session.event_type

  return (
    <div className="flex flex-wrap gap-3">
      {eventType && (
        <Tag color={eventsColors[session.event_type]}>{eventType}</Tag>
      )}
      {session.audience && (
        <Tag
          color={eventsColors[session.audience] || "hsl(var(--color-neu-700))"}
        >
          {session.audience}
        </Tag>
      )}
      {session.event_subtype && (
        <Tag
          color={
            eventsColors[session.event_subtype] || "hsl(var(--color-sec-base))"
          }
        >
          {session.event_subtype}
        </Tag>
      )}
    </div>
  )
}
