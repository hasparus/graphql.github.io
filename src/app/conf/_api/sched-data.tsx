import { ConferenceYear, SchedSpeaker } from "./sched-types"

const allSpeakers: SchedSpeaker[] = require("../../../../scripts/sync-sched/speakers.json")

export async function readSpeakers(year: ConferenceYear): SchedSpeaker[] {
  return (
    allSpeakers
      .filter(speaker => speaker["~years"].includes(year))
      .sort((a, b) => a.name.localeCompare(b.name))
      // show speakers without avatars last
      .sort((a, b) => {
        if (a.avatar && !b.avatar) return -1
        if (!a.avatar && b.avatar) return 1
        return 0
      })
  )
}
