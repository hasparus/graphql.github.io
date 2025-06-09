import "server-only"

import { getSchedule, getSpeakers } from "../_api/sched-client"

const ctx = {
  apiUrl: "https://graphqlconf2024.sched.com/api",
  token: process.env.SCHED_ACCESS_TOKEN_2024!,
}

export const speakers = await getSpeakers(ctx)
export const schedule = await getSchedule(ctx)
