#!/usr/bin/env tsx

import assert from "node:assert"
import { parseArgs } from "node:util"

import { getSchedule, getSpeakers } from "@/app/conf/_api/sched-client"

// Sched API rate limit is 30 requests per minute per token.
// This scripts fires:
// - one request for the entire schedule which overwritten
// - one request for the list of speakers with partial details
// - and N requests for the full details of each speaker
const SPEAKER_DETAILS_REQUEST_QUOTA = 10

const options = {
  year: {
    type: "string" as const,
    short: "y",
  },
  help: {
    type: "boolean" as const,
    short: "h",
  },
}

function main() {
  try {
    const { values } = parseArgs({ options })

    if (values.help) {
      help()
      process.exit(0)
    }

    const year = parseInt(values.year || new Date().getFullYear().toString())

    console.log(`Syncing schedule for year: ${year}`)

    const token = process.env[`SCHED_ACCESS_TOKEN_${year}`]
    assert(token, `SCHED_ACCESS_TOKEN_${year} is not set`)

    // TODO: Implement sync logic here
    // You can now use the `year` variable in your sync logic
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unknown option")) {
      console.error(`Error: ${error.message}`)
      help()
      process.exit(1)
    }
    throw error
  }
}

if (require.main === module) {
  main()
}

async function sync(year: number, token: string) {
  const apiUrl = {
    2023: "https://graphqlconf23.sched.com/api",
    2024: "https://graphqlconf2024.sched.com/api",
    2025: "https://graphqlconf2025.sched.com/api",
  }[year]

  assert(apiUrl, `API URL for year ${year} not found`)

  const ctx = { apiUrl, token }

  console.log("Getting schedule and speakers list...")
  const [schedule, speakers] = await Promise.all([
    getSchedule(ctx),
    getSpeakers(ctx),
  ])

  // console.log("Getting speaker details...")
  // const speakerDetails = await Promise.all(
  //   speakers.map(speaker => getSpeakerDetails(ctx, speaker.username)),
  // )
}

function help() {
  return console.log("Usage: tsx sync.ts --year <year>")
}
