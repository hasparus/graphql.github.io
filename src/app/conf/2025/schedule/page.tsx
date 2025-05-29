import { Metadata } from "next"

import { schedule } from "../_data"
import { ScheduleList } from "./_components/schedule-list"
import { filterCategories2024 } from "./_components/filter-categories"
import { eventsColors } from "../utils"
import { Button } from "../../_design-system/button"
import { GET_TICKETS_LINK } from "../links"
import { Hero } from "../components/hero"

const year = "2025"

export const metadata: Metadata = {
  title: "Schedule",
}

export default function SchedulePage() {
  return (
    <main className="gql-all-anchors-focusable bg-neu-50 dark:bg-neu-0">
      <Hero pageName="Schedule" year={year}>
        <div className="mt-[18px] flex gap-4">
          <Button href={GET_TICKETS_LINK}>Get your tickets</Button>
          <Button variant="tertiary" href={`/conf/${year}/speakers`}>
            See the speakers
          </Button>
        </div>
      </Hero>
      <div className="gql-conf-container gql-conf-section 2xl:!px-24">
        <ScheduleList
          filterCategories={filterCategories2024}
          eventsColors={eventsColors}
          year={year}
          scheduleData={schedule}
        />
      </div>
    </main>
  )
}
