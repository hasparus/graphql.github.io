import { SchedSpeaker } from "./sched-types"

const allSpeakers: SchedSpeaker[] = require("../../../../scripts/sync-sched/speakers.json")

export async function readSpeakers(year: "2025" | "2024" | "2023") {
  return allSpeakers.filter(speaker => speaker["~years"].includes(year))
}
