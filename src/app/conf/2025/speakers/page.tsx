import { Metadata } from "next"
import { speakers } from "../_data"
import { Speaker } from "@/app/conf/_components/speakers/speaker"
import { Hero } from "../components/hero"
import { Button } from "../../_design-system/button"
import { GET_TICKETS_LINK } from "../links"

export const metadata: Metadata = {
  title: "Speakers",
}

export default function Page() {
  const year = "2025"

  return (
    <main className="gql-all-anchors-focusable bg-neu-50 dark:bg-neu-0">
      <Hero pageName="Speakers" year={year}>
        <div className="mt-[18px] flex gap-4">
          <Button href={GET_TICKETS_LINK}>Get your tickets</Button>
          <Button variant="tertiary" href={`/conf/${year}/schedule`}>
            See the schedule
          </Button>
        </div>
      </Hero>

      <div className="bg-white">
        <section className="conf-block container flex flex-wrap justify-center gap-8 lg:justify-between">
          {speakers.map(speaker => (
            <Speaker key={speaker.username} {...speaker} year="2024" />
          ))}
        </section>
      </div>
    </main>
  )
}
