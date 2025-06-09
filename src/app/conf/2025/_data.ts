import "server-only"

import { SchedSpeaker, ScheduleSession } from "@/app/conf/2023/types"

import { getSpeakers, getSchedule } from "../_api/sched-client"
import { speakers as speakers2024 } from "../2024/_data"
import { speakers as speakers2023 } from "../2023/_data"

const USE_2025 = false || process.env.USE_2025 === "true"

const apiUrl = USE_2025
  ? "https://graphqlconf2025.sched.com/api"
  : "https://graphqlconf2024.sched.com/api"

const token = USE_2025
  ? process.env.SCHED_ACCESS_TOKEN_2025!
  : process.env.SCHED_ACCESS_TOKEN_2024!

const ctx = {
  apiUrl,
  token,
}

export const speakers = await getSpeakers(ctx)
export const schedule = await getSchedule(ctx)

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

export const returningSpeakers = new Set<SpeakerUsername>()

for (const { username } of speakers2024) {
  if (speakerSessions.has(username)) {
    returningSpeakers.add(username)
  }
}

for (const { username } of speakers2023) {
  if (speakerSessions.has(username)) {
    returningSpeakers.add(username)
  }
}
