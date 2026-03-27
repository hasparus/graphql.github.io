import { Metadata } from "next"

import { schedule } from "../_data"
import { ScheduleList, FiltersConfig } from "./_components/schedule-list"
import { eventsColors, HERO_MARQUEE_ITEMS } from "../utils"
import { Button } from "@/app/conf/_design-system/button"
import { Hero } from "../components/hero"
import { CtaCardSection } from "../components/cta-card-section"
import { MarqueeRows } from "@/app/conf/2026/components/marquee-rows"

const year = "2026"

const FILTERS: FiltersConfig = {
  event_type: "Session Format",
  event_subtype: "Talk Category",
  audience: "Audience",
}

export const metadata: Metadata = {
  title: "Schedule",
}

export default function SchedulePage() {
  return (
    <main className="gql-all-anchors-focusable bg-neu-50 dark:bg-neu-0">
      <Hero pageName="Schedule" year={year} />
      <div className="gql-container gql-section 2xl:!px-24">
        {schedule.length > 0 ? (
          <ScheduleList
            eventsColors={eventsColors}
            year={year}
            scheduleData={schedule}
            filterFields={FILTERS}
          />
        ) : (
          <p className="typography-body-lg py-12 text-center text-neu-700">
            Schedule coming soon.
          </p>
        )}
      </div>
      <div className="gql-conf-navbar-strip border-t border-neu-200 bg-neu-0 py-8 text-neu-900 before:bg-white/40 dark:border-neu-100 before:dark:bg-blk/30 xl:py-16">
        <div className="gql-container">
          <CtaCardSection
            title="Stay tuned"
            description="The schedule will be announced soon."
          >
            <Button disabled variant="primary" className="opacity-55">
              Coming soon
            </Button>
          </CtaCardSection>
          <div className="py-8">
            <MarqueeRows variant="secondary" items={HERO_MARQUEE_ITEMS} />
          </div>
        </div>
      </div>
    </main>
  )
}
