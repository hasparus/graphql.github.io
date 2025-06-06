import SpeakerOpengraphImage from "@/app/conf/2025/components/speaker-opengraph-image"
import ScheduleOpengraphImage from "@/app/conf/2025/components/session-opengraph-image"
import { SchedSpeaker } from "@/app/conf/2023/types"

/**
 * This is cheaper than maintaining a Storybook config.
 */
export default function WorkroomPage() {
  const enisdenjo: SchedSpeaker = {
    name: "Denis Badurina",
    username: "enisdenjo",
    avatar: "https://github.com/enisdenjo.png",
    company: "The Guild",
    position: "Software Architect",
    about:
      "Denis is a software architect at The Guild. He is a passionate about GraphQL and the GraphQL ecosystem.",
    role: "speaker",
    socialurls: [],
    year: "2025",
  }

  const saihaj: SchedSpeaker = {
    name: "Saihajpreet Singh",
    username: "saihaj",
    avatar: "https://github.com/saihaj.png",
    company: "The Guild",
    position: "Head of Growth & Product",
    about:
      "I'm an engineer focused on building developer tools, infrastructure, and application solutions, while experimenting with practical AI applications. Always accelerating efficiently.",
    role: "speaker",
    socialurls: [],
    year: "2025",
  }

  return (
    <main className="gql-conf-section gql-conf-container [&>p]:pt-8 [&>p]:font-mono [&>p]:text-sm [&>p]:text-neu-600">
      <p>SpeakerOpengraphImage</p>
      <SpeakerOpengraphImage
        speaker={enisdenjo}
        date="September 8-10"
        year="2025"
        location="Amsterdam, Netherlands"
      />

      <p>ScheduleOpengraphImage / no speakers</p>
      <ScheduleOpengraphImage
        session={{
          name: "Welcome & Opening Remarks",
          speakers: [],
          event_type: "",
        }}
        date="September 8-10"
        year="2025"
        location="Amsterdam, Netherlands"
      />

      <p>ScheduleOpengraphImage / single speaker</p>
      <ScheduleOpengraphImage
        session={{
          name: "The State of Distributed GraphQL",
          speakers: [enisdenjo],
          event_type: "Keynote Sessions",
        }}
        date="September 8-10"
        year="2025"
        location="Amsterdam, Netherlands"
      />

      <p>ScheduleOpengraphImage / multiple speakers</p>
      <ScheduleOpengraphImage
        session={{
          name: "TSC Panel",
          speakers: [enisdenjo, saihaj],
          event_type: "Keynote Sessions",
        }}
        date="September 8-10"
        year="2025"
        location="Amsterdam, Netherlands"
      />

      <p>SpeakerOpengraphImage / very long title</p>
      <ScheduleOpengraphImage
        session={{
          name: "TSC Panel - Lee Byron, GraphQL Foundation; Kewei Qu, Meta; Rob Richard, 1stDibs; Michael Staib, ChilliCream; Moderated by Sasha Solomon, Staff Software Engineer & Tech Lead",
          speakers: [
            {
              ...enisdenjo,
              name: "Lee Byron",
            },
            {
              ...enisdenjo,
              name: "Kewei Qu",
            },
            {
              ...enisdenjo,
              name: "Rob Richard",
            },
            {
              ...enisdenjo,
              name: "Michael Staib",
            },
            { ...enisdenjo, name: "Sasha Solomon" },
          ],
          event_type: "Keynote Sessions",
        }}
        date="September 8-10"
        year="2025"
        location="Amsterdam, Netherlands"
      />
    </main>
  )
}
