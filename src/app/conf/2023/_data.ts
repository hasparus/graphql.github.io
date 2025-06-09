import "server-only"

import { SchedSpeaker, ScheduleSession } from "../_api/sched-types"

export const schedule: ScheduleSession[] = require("../../../../scripts/sync-sched/schedule-2023.json")
export const speakers: SchedSpeaker[] = require("../../../../scripts/sync-sched/speakers.json")
