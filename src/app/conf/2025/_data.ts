import "server-only"

import { SchedSpeaker, ScheduleSession } from "@/app/conf/2023/types"
import { readSpeakers } from "../_api/sched-data"

export const schedule: ScheduleSession[] = require("../../../../scripts/sync-sched/schedule-2025.json")
export const speakers: SchedSpeaker[] = readSpeakers(2025)

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
