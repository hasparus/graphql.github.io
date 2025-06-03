import { SessionCard } from "./session-card"
import { eventsColors } from "../2025/utils"
import { ScheduleSession } from "../2023/types"

// Example session data
const sampleSession: ScheduleSession = {
  id: "example-session",
  audience: "developers",
  description: "Learn how to build amazing GraphQL applications with Isograph",
  event_end: "2024-09-08T11:00:00Z",
  event_start: "2024-09-08T10:30:00Z",
  event_subtype: "Technical",
  event_type: "Session Presentations",
  name: "Performing Impossible Feats with Isograph",
  venue: "Metropolitan A",
  speakers: [
    {
      username: "robert-balicki",
      name: "Robert Balicki",
      about: "Senior Engineer at Meta",
      company: "Meta",
      position: "Senior Engineer",
      role: "speaker",
      socialurls: [],
      year: "2024",
    },
  ],
}

export function SessionCardExample() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h2 className="typography-h2 mb-4">Current Session Card</h2>
        <SessionCard
          session={sampleSession}
          variant="current"
          eventColors={eventsColors}
          className="max-w-md"
        />
      </div>

      <div>
        <h2 className="typography-h2 mb-4">Previous Session Card</h2>
        <SessionCard
          session={sampleSession}
          variant="previous"
          eventColors={eventsColors}
          className="max-w-md"
        />
      </div>
    </div>
  )
}
