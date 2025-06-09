#!/usr/bin/env tsx

import assert from "node:assert"
import { parseArgs } from "node:util"
import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"

import {
  getSchedule,
  getSpeakerDetails,
  getSpeakers,
  RequestContext,
} from "@/app/conf/_api/sched-client"
import { SchedSpeaker, ScheduleSession } from "@/app/conf/_api/sched-types"
import { readFile, writeFile } from "node:fs/promises"

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

const unsafeKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>

async function main() {
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

    await sync(year, token)
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
  void main()
}

async function sync(year: number, token: string) {
  const apiUrl = {
    2023: "https://graphqlconf23.sched.com/api",
    2024: "https://graphqlconf2024.sched.com/api",
    2025: "https://graphqlconf2025.sched.com/api",
  }[year]

  assert(apiUrl, `API URL for year ${year} not found`)

  const ctx: RequestContext = { apiUrl, token }

  const scriptDir = __dirname
  const speakersFilePath = join(scriptDir, "speakers.json")
  const scheduleFilePath = join(scriptDir, `schedule-${year}.json`)

  console.log("Getting schedule and speakers list...")

  const schedule = getSchedule(ctx)
  const speakers = getSpeakers(ctx)
  const existingSchedule = readFile(scheduleFilePath, "utf-8").then(JSON.parse)
  const existingSpeakers = readFile(speakersFilePath, "utf-8").then(JSON.parse)

  const scheduleComparison = compare(
    await existingSpeakers,
    await schedule,
    "id",
    { merge: false },
  )
  printComparison(scheduleComparison, "sessions", "id")

  const writeSchedule = writeFile(
    scheduleFilePath,
    JSON.stringify(await schedule, null, 2),
  )

  const speakerComparison = compare(
    await existingSpeakers,
    await speakers,
    "username",
    { merge: true },
  )

  await updateSpeakerDetails(
    ctx,
    speakerComparison,
    SPEAKER_DETAILS_REQUEST_QUOTA,
  )

  printComparison(speakerComparison, "speakers", "username")

  const updatedSpeakers = [
    ...speakerComparison.removed,
    ...speakerComparison.unchanged,
    ...speakerComparison.changed.map(change => change.new),
    ...speakerComparison.added,
  ].sort((a, b) => a.username.localeCompare(b.username))

  const writeSpeakers = writeFile(
    speakersFilePath,
    JSON.stringify(updatedSpeakers, null, 2),
  )

  await writeSchedule
  await writeSpeakers
}

async function updateSpeakerDetails(
  ctx: RequestContext,
  /** mutated in place */
  comparison: Comparison<SchedSpeaker>,
  quota: number,
) {
  const locations = new Map<
    string /* username */,
    [key: keyof Comparison<unknown>, index: number]
  >()

  for (const key of unsafeKeys(comparison)) {
    const items = comparison[key as keyof Comparison<SchedSpeaker>]
    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      if (!("username" in item)) item = item.new
      locations.set(item.username, [key, i])
    }
  }

  const byUpdateTime = [
    ...comparison.unchanged,
    ...comparison.changed.map(change => change.new),
    ...comparison.added,
  ].sort((a, b) => {
    const aTime = a["~syncedDetailsAt"] ?? 0
    const bTime = b["~syncedDetailsAt"] ?? 0
    return bTime - aTime
  })

  const toUpdate = byUpdateTime.slice(0, quota)

  const updated = await Promise.all(
    toUpdate.map(speaker => getSpeakerDetails(ctx, speaker.username)),
  )

  for (const speaker of updated) {
    const location = locations.get(speaker.username)
    if (location) {
      const [key, index] = location
      comparison[key][index] = speaker
    }
  }
}

function help() {
  return console.log("Usage: tsx sync.ts --year <year>")
}

// #region utility

type Change<T> = { old: T; new: T }
type Comparison<T> = {
  added: T[]
  removed: T[]
  changed: Change<T>[]
  unchanged: T[]
}

function compare<T extends object>(
  olds: T[],
  news: T[],
  key: keyof T,
  options: { merge: boolean },
) {
  const oldMap = new Map(olds.map(o => [o[key], o]))
  const newMap = new Map(news.map(n => [n[key], n]))

  const added: T[] = []
  const removed: T[] = []
  const changed: Change<T>[] = []
  const unchanged: T[] = []

  for (const newItem of news) {
    const oldItem = oldMap.get(newItem[key])
    if (oldItem) {
      if (JSON.stringify(oldItem) === JSON.stringify(newItem)) {
        unchanged.push(oldItem)
      } else {
        changed.push({
          old: oldItem,
          new: options.merge ? { ...oldItem, ...newItem } : newItem,
        })
      }
    } else {
      added.push(newItem)
    }
  }

  for (const oldItem of olds) {
    if (!newMap.has(oldItem[key])) {
      removed.push(oldItem)
    }
  }

  return { added, removed, changed, unchanged }
}

function printComparison<T extends object>(
  comparison: Comparison<T>,
  name: string,
  key: keyof T,
) {
  console.log(`Removed: ${comparison.removed.length}`)
  console.log(`Changed: ${comparison.changed.length}`)
  console.log(`Unchanged: ${comparison.unchanged.length}`)

  console.log(`Added ${comparison.added.length} ${name}`)
  for (const item of comparison.added) {
    console.log(`+ ${item}`)
  }

  console.log(`Removed ${comparison.removed.length} ${name}`)
  for (const item of comparison.removed) {
    console.log(`- ${item}`)
  }

  console.log(`Unchanged ${comparison.unchanged.length} ${name}`)
  for (const item of comparison.unchanged) {
    console.log(item)
  }

  console.log(`Changed ${comparison.changed.length} ${name}`)
  for (const change of comparison.changed) {
    console.log(change.new[key], objectDiff(change))
  }
}

function objectDiff<T extends object>(change: Change<T>): string {
  const allKeys = [
    ...new Set([...unsafeKeys(change.old), ...unsafeKeys(change.new)]),
  ].sort()

  const diff = allKeys
    .map(key => {
      const oldValue = change.old[key]
      const newValue = change.new[key]

      if (oldValue === newValue) {
        return null
      }

      return { key, oldValue, newValue }
    })
    .filter(x => !!x)

  return diff
    .map(diff => {
      return `\x1b[33m${String(diff.key)}\x1b[0m: ${diff.oldValue} -> ${diff.newValue}`
    })
    .join("\n")
}

// #endregion utility
