import "server-only"
import { stripHtml } from "string-strip-html"
import { SchedSpeaker, ScheduleSession } from "@/app/conf/2023/types"
import pLimit from "p-limit"

const USE_2025 = false

const apiUrl = USE_2025
  ? "https://graphqlconf2025.sched.com/api"
  : "https://graphqlconf2024.sched.com/api"

const token = USE_2025
  ? process.env.SCHED_ACCESS_TOKEN_2025
  : process.env.SCHED_ACCESS_TOKEN_2024

async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "GraphQL Conf / GraphQL Foundation",
      },
    })
    const data = await response.json()
    return data
  } catch (error) {
    throw new Error(
      `Error fetching data from ${url}: ${(error as Error).message || (error as Error).toString()}`,
    )
  }
}

async function getUsernames(): Promise<string[]> {
  const response = await fetchData<{ username: string }[]>(
    `${apiUrl}/user/list?api_key=${token}&format=json&fields=username`,
  )
  return response.map(user => user.username)
}

const limit = pLimit(40) // rate limit is 30req/min

async function getSpeakers(): Promise<SchedSpeaker[]> {
  const usernames = await getUsernames()

  const users = await Promise.all(
    usernames.map(username =>
      limit(() => {
        return fetchData<SchedSpeaker>(
          `${apiUrl}/user/get?api_key=${token}&by=username&term=${username}&format=json&fields=username,company,position,name,about,location,url,avatar,role,socialurls`,
        )
      }),
    ),
  )

  const result = users
    .filter(speaker => speaker.role.includes("speaker"))
    .map(user => {
      return {
        ...user,
        about: stripHtml(user.about).result,
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
    if (description?.includes("<")) {
      // console.log(`Found HTML element in about field for session "${session.name}"`)
    }

    // TODO: Preserve formatting??
    return {
      ...session,
      description: description && stripHtml(description).result,
    }
  })

  return result
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

import { speakers as speakers2024 } from "../2024/_data"
import { speakers as speakers2023 } from "../2023/_data"

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

console.log({
  returningSpeakers: returningSpeakers.size,
})
