import "server-only"

import { SchedSpeaker, ScheduleSession } from "@/app/conf/2023/types"

const schedule: ScheduleSession[] = require("../../../../scripts/sync-sched/schedule-2025.json")
const speakers: SchedSpeaker[] = require("../../../../scripts/sync-sched/speakers.json")

type SpeakerUsername = SchedSpeaker["username"]

export const speakerSessions = new Map<SpeakerUsername, ScheduleSession[]>()

for (const session of schedule) {
  for (const speaker of session.speakers || []) {
    if (!speakerSessions.has(speaker.username)) {
      speakerSessions.set(speaker.username, [])
    }

    speakerSessions.get(speaker.username)!.push(session)
  }
}
