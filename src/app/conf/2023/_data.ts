import "server-only"
import { stripHtml } from "string-strip-html"

import { SchedSpeaker, ScheduleSession } from "@/app/conf/2023/types"
import { fetchSchedData } from "../_api/sched-client"

const token = process.env.SCHED_ACCESS_TOKEN_2023

async function getSpeakers(): Promise<SchedSpeaker[]> {
  const users = await fetchSchedData<SchedSpeaker[]>(
    `https://graphqlconf23.sched.com/api/user/list?api_key=${token}&format=json&fields=username,company,position,name,about,location,url,avatar,role,socialurls`,
  )

  const result = users
    .filter(user => user.role.includes("speaker"))
    .map(user => {
      return {
        ...user,
        about: stripHtml(user.about).result,
      }
    })

  return result
}

async function getSchedule(): Promise<ScheduleSession[]> {
  const sessions = await fetchSchedData<ScheduleSession[]>(
    `https://graphqlconf23.sched.com/api/session/export?api_key=${token}&format=json`,
  )

  const result = sessions.map(session => {
    const { description } = session
    if (description?.includes("<")) {
      // console.log(`Found HTML element in about field for session "${session.name}"`)
    }

    return {
      ...session,
      description: description && stripHtml(description).result,
    }
  })

  return result
}

export const speakers = await getSpeakers()

export const schedule = await getSchedule()
