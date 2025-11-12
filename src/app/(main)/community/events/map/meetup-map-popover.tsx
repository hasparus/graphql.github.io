"use client"

import { meetups } from "@/components/meetups"

export type MeetupMapPointer = {
  x: number
  y: number
  visible: boolean
}

const meetupNameById = new Map(meetups.map(({ node }) => [node.id, node.name]))

type MeetupMapPopoverProps = {
  activeMeetupId: string | null
  pointer: MeetupMapPointer
}

export function MeetupMapPopover({ activeMeetupId, pointer }: MeetupMapPopoverProps) {
  if (!activeMeetupId || !pointer.visible) return null
  const name = meetupNameById.get(activeMeetupId)
  if (!name) return null
  return (
    <div
      data-testid="meetup-map-popover"
      className="pointer-events-none absolute z-10 hidden min-w-0 -translate-x-1/2 -translate-y-3 whitespace-nowrap rounded border border-neu-100 bg-neu-0 px-2 py-1 text-xs font-medium text-neu-900 shadow-sm group-hover/map:flex"
      style={{
        left: pointer.x,
        top: pointer.y,
      }}
    >
      {name}
    </div>
  )
}
