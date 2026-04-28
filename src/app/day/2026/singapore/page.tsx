import { Metadata } from "next"

import { Button } from "@/app/conf/_design-system/button"
import { Hero, HeroDateAndLocation } from "../components/hero"
import { AboutSection } from "../components/about-section"
import { WhyAttendSection } from "../components/why-attend-section"
import { EventPartnersSection } from "../components/event-partners"
import { CtaCardSection } from "../components/cta-card-section"
import { MarqueeRows } from "@/app/conf/2026/components/marquee-rows"
import { PastSpeakersSection } from "../components/past-speakers"
import { NavbarPlaceholder } from "../components/navbar"
import { GallerySection } from "../../gallery-section"
import { ScheduleSection } from "./schedule-section"

const SCHEDULE_ANCHOR = "#schedule"

const MARQUEE_ITEMS = [
  ["SINGAPORE", "APRIL 2026", "GRAPHQL DAY", "FOST", "COMMUNITY", "APIs"],
  [
    "OPEN SOURCE",
    "WORKSHOPS",
    "FEDERATION",
    "DEVELOPER EXPERIENCE",
    "GRAPHQL DAY",
    "SINGAPORE",
  ],
]

export const metadata: Metadata = {
  title: "GraphQL Day @ FOST Singapore — Apr 14-15",
}

export default function SingaporePage() {
  return (
    <>
      <NavbarPlaceholder className="top-0 bg-neu-100 before:bg-white/30 dark:bg-neu-50/50 dark:before:bg-blk/40" />
      <main className="gql-all-anchors-focusable">
        <Hero subtitle="@ FOST Singapore" colorScheme="neutral">
          <HeroDateAndLocation
            date="April 14-15, 2026"
            dateTime="2026-04-14"
            location="Singapore"
          />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 max-sm:*:flex-1">
            <Button
              href={SCHEDULE_ANCHOR}
              className="whitespace-nowrap md:w-fit"
            >
              View the schedule
            </Button>
          </div>
        </Hero>
        <AboutSection />
        <MarqueeRows
          variant="primary"
          className="z-10 bg-neu-0 py-4 max-sm:pb-1 sm:py-6 md:space-y-2 md:py-12"
          items={MARQUEE_ITEMS}
        />
        <div className="gql-container gql-conf-navbar-strip text-neu-900 before:bg-white/40 before:dark:bg-blk/30">
          <ScheduleSection />
          <WhyAttendSection />
          <PastSpeakersSection />
          <EventPartnersSection />
          <GallerySection moving />
          <CtaCardSection
            title="View the schedule"
            description="Catch up on the talks, descriptions, and speakers from GraphQL Day @ FOST Singapore."
          >
            <Button
              href={SCHEDULE_ANCHOR}
              variant="primary"
              className="whitespace-nowrap"
            >
              View the schedule
            </Button>
          </CtaCardSection>
          <MarqueeRows
            variant="secondary"
            className="my-8 xl:mb-16 xl:mt-10"
            items={MARQUEE_ITEMS}
          />
        </div>
      </main>
    </>
  )
}
