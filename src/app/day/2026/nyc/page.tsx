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

export const metadata: Metadata = {
  title: "GraphQL Day @ FOST NYC — May 13-14",
}

export default function NYCPage() {
  return (
    <main className="gql-all-anchors-focusable">
      <Hero subtitle="@ FOST NYC">
        <HeroDateAndLocation
          date="May 13-14, 2026"
          dateTime="2026-05-13"
          location="New York City"
        />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 max-sm:*:flex-1">
          <Button disabled className="whitespace-nowrap opacity-55 md:w-fit">
            Tickets coming soon
          </Button>
        </div>
      </Hero>
      <MarqueeRows
        variant="primary"
        className="pt-4 max-sm:pb-1 sm:pt-6 md:space-y-2 md:pt-12 xl:pt-16"
        items={[
          ["NEW YORK", "MAY 2026", "GRAPHQL DAY", "FOST"],
          ["COMMUNITY", "OPEN SOURCE", "APIs", "WORKSHOPS"],
        ]}
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
          items={[
            ["NEW YORK", "MAY 2026", "GRAPHQL DAY", "FOST"],
            ["COMMUNITY", "OPEN SOURCE", "APIs", "WORKSHOPS"],
          ]}
        />
        <CtaCardSection
          title="Stay tuned"
          description="Join us for a day of GraphQL talks, networking, and hands-on learning at FOST NYC."
        >
          <Button
            disabled
            variant="primary"
            className="whitespace-nowrap opacity-55"
          >
            Tickets coming soon
          </Button>
        </CtaCardSection>
      </div>
    </main>
  )
}
