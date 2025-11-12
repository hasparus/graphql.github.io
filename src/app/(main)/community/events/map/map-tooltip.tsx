"use client"

import { meetups } from "@/components/meetups"

export type MeetupMapPointer = {
  x: number
  y: number
  visible: boolean
}

const meetupNameById = new Map(meetups.map(({ node }) => [node.id, node.name]))

type MapTooltipProps = {
  id: string
  activeMeetupId: string | null
  pointer: MeetupMapPointer
}

export function MapTooltip({ id, activeMeetupId, pointer }: MapTooltipProps) {
  if (!activeMeetupId || !pointer.visible) return null
  const name = meetupNameById.get(activeMeetupId)
  if (!name) return null
  return (
    <span
      id={id}
      role="tooltip"
      className="pointer-events-none absolute left-0 top-0 z-10 hidden min-w-0 whitespace-nowrap border border-neu-200/40 bg-neu-0/40 px-2 py-1 text-xs font-medium text-neu-900 shadow-sm backdrop-blur-sm group-hover/map:flex"
      style={{
        transform: `translate3d(calc(${pointer.x}px - 50%), calc(${pointer.y}px - 50% - 24px), 0)`,
      }}
    >
      {name}
    </span>
  )
}
