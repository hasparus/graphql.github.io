import { Metadata } from "next"

import { Button } from "@/app/conf/_design-system/button"
import { Hero, HeroDateAndLocation } from "../components/hero"
import { AboutSection } from "../components/about-section"
import { WhyAttendSection } from "../components/why-attend-section"
import { BecomeASpeakerSection } from "../components/become-a-speaker"
import { EventPartnersSection } from "../components/event-partners"
import { CtaCardSection } from "../components/cta-card-section"
import { MarqueeRows } from "../components/marquee-rows"
import { PastSpeakersSection } from "../components/past-speakers"

const TICKET_LINK =
  "https://portal.joinfost.io/event/future-of-software-technologies-singapore-2026/9521470b-6661-4c85-8594-b74d9d7cf2e3/graphql-day-at-fost-singapore"

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
    <main className="gql-all-anchors-focusable">
      <Hero subtitle="@ FOST Singapore">
        <HeroDateAndLocation
          date="April 14-15, 2026"
          dateTime="2026-04-14"
          location="Singapore"
        />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 max-sm:*:flex-1">
          <Button href={TICKET_LINK} className="whitespace-nowrap md:w-fit">
            Get your ticket
          </Button>
        </div>
      </Hero>
      <MarqueeRows
        variant="primary"
        className="pt-4 max-sm:pb-1 sm:pt-6 md:space-y-2 md:pt-12 xl:pt-16"
        items={MARQUEE_ITEMS}
      />
      <AboutSection />
      <div className="gql-container gql-conf-navbar-strip text-neu-900 before:bg-white/40 before:dark:bg-blk/30">
        <WhyAttendSection />
        <BecomeASpeakerSection />
        <PastSpeakersSection />
        <EventPartnersSection />
        <MarqueeRows
          variant="secondary"
          className="my-8 xl:mb-16 xl:mt-10"
          items={MARQUEE_ITEMS}
        />
        <CtaCardSection
          title="Get your ticket"
          description="Join us for a day of GraphQL talks, networking, and hands-on learning at FOST Singapore."
        >
          <Button
            href={TICKET_LINK}
            variant="primary"
            className="whitespace-nowrap"
          >
            Get your ticket
          </Button>
        </CtaCardSection>
      </div>
    </main>
  )
}
