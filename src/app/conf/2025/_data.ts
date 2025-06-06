import "server-only"
import { stripHtml } from "string-strip-html"
import { SchedSpeaker, ScheduleSession } from "@/app/conf/2023/types"

import { fetchData } from "../_api/sched-client"
import { speakers as speakers2024 } from "../2024/_data"
import { speakers as speakers2023 } from "../2023/_data"

const USE_2025 = true

const apiUrl = USE_2025
  ? "https://graphqlconf2025.sched.com/api"
  : "https://graphqlconf2024.sched.com/api"

const token = USE_2025
  ? process.env.SCHED_ACCESS_TOKEN_2025
  : process.env.SCHED_ACCESS_TOKEN_2024

async function getSpeakers(): Promise<SchedSpeaker[]> {
  const users = await fetchData<SchedSpeaker[]>(
    `${apiUrl}/user/list?api_key=${token}&format=json&fields=username,company,position,name,about,location,url,avatar,role,socialurls`,
  )

  const result = users
    .filter(speaker => speaker.role.includes("speaker"))
    .map(user => {
      return {
        ...user,
        about: preprocessDescription(user.about),
      }
    })
    .sort((a, b) => {
      if (a.avatar && !b.avatar) return -1
      if (!a.avatar && b.avatar) return 1
      return 0
    })

  return result
}

async function getSchedule(): Promise<ScheduleSession[]> {
  const sessions = await fetchData<ScheduleSession[]>(
    `${apiUrl}/session/export?api_key=${token}&format=json`,
  )

  const result = sessions.map(session => {
    const { description } = session

    return {
      ...session,
      description: preprocessDescription(description),
    }
  })

  return result
}

function preprocessDescription(description: string | undefined | null): string {
  let res = description || ""

  // we respect manual line breaks
  res = res.replace(/<br\s*\/?>/g, "\n")

  // respecting <li> and <a> tags doesn't make sense, because speakers don't use them consistently
  // we'll improve how the descriptions look later down the tree in the session details page
  return stripHtml(res).result
}

export const speakers = await getSpeakers()

// TODO: Collect tags from schedule for speakers.
export const schedule = await getSchedule()

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

const longestSessionName = schedule.reduce((max, session) => {
  if (session.name.length > max.length) {
    return session.name
  }
  return max
}, "")

console.log({ longestSessionName })
