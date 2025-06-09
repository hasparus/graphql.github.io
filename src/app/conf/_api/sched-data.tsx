import { ConferenceYear, SchedSpeaker } from "./sched-types"

const allSpeakers: SchedSpeaker[] = require("../../../../scripts/sync-sched/speakers.json")

export async function readSpeakers(year: ConferenceYear) {
  return allSpeakers.filter(speaker => speaker["~years"].includes(year))
}
