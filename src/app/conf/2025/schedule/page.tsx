import { Metadata } from "next"

import { schedule } from "../_data"
import { ScheduleList } from "./_components/schedule-list"
import { filterCategories2024 } from "./_components/filter-categories"
import { eventsColors } from "../utils"
import { HeroStripes } from "../components/hero"
import { Button } from "../../_design-system/button"
import { GET_TICKETS_LINK } from "../links"
import graphqlFoundationWordmarkSvg from "../assets/graphql-foundation-wordmark.svg"

export const metadata: Metadata = {
  title: "Schedule",
}

export default function SchedulePage() {
  return (
    <main className="gql-all-anchors-focusable bg-neu-50 dark:bg-neu-0">
      <ScheduleHero />
      <div className="gql-conf-container gql-conf-section">
        <a
          href="https://graphqlconf2024.sched.com"
          target="_blank"
          rel="noreferrer"
          className="typography-link"
        >
          🔗 Bookmark sessions & plan your days on Sched
        </a>
        <ScheduleList
          filterCategories={filterCategories2024}
          eventsColors={eventsColors}
          year="2025"
          scheduleData={schedule}
        />
      </div>
    </main>
  )
}

function ScheduleHero() {
  return (
    <article className="gql-conf-navbar-strip relative isolate flex flex-col justify-center bg-pri-base text-neu-0 selection:bg-blk/40 before:bg-white/30 dark:bg-pri-darker dark:text-neu-900 dark:selection:bg-white/40 before:dark:bg-blk/40">
      <HeroStripes />
      <div className="gql-conf-container mx-auto flex max-w-full flex-col gap-12 overflow-hidden p-4 pt-6 sm:p-8 sm:pt-12 md:gap-12 md:bg-left md:p-12 lg:px-24 lg:pb-16 lg:pt-24">
        <div className="flex gap-10 max-md:flex-col md:justify-between">
          <div>
            <span className="text-sec-base typography-h3">
              GraphQLConf 2025
            </span>
            <h1 className="typography-d1">Schedule</h1>
          </div>
          <div className="flex h-min items-center gap-4">
            <span className="whitespace-pre typography-body-sm">hosted by</span>
            <img
              src={graphqlFoundationWordmarkSvg.src}
              alt="GraphQL Foundation"
              width={128}
              height={34.877}
            />
          </div>
        </div>

        <div className="flex flex-col gap-8 pt-[18px]">
          <Button className="md:w-fit" href={GET_TICKETS_LINK}>
            Get your tickets
          </Button>
        </div>
      </div>
    </article>
  )
}
