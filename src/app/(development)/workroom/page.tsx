import SpeakerOpengraphImage from "@/app/conf/2025/components/speaker-opengraph-image"

/**
 * This is cheaper than maintaining a Storybook config.
 */
export default function WorkroomPage() {
  return (
    <main>
      <SpeakerOpengraphImage
        speaker={{
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
        }}
        date="September 8-10"
        location="Amsterdam, Netherlands"
      />
    </main>
  )
}
