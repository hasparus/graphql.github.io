import { Metadata } from "next"

import { Button } from "@/app/conf/_design-system/button"
import { Hero, HeroDateAndLocation } from "../components/hero"
import { AboutSection } from "../components/about-section"
import { WhyAttendSection } from "../components/why-attend-section"
import { BecomeASpeakerSection } from "../components/become-a-speaker"
import { EventPartnersSection } from "../components/event-partners"
import { CtaCardSection } from "../components/cta-card-section"

export const metadata: Metadata = {
  title: "GraphQL Day @ FOST Paris — Dec 1-3",
}

export default function ParisPage() {
  return (
    <main className="gql-all-anchors-focusable">
      <Hero subtitle="@ FOST Paris">
        <HeroDateAndLocation
          date="December 1-3, 2026"
          dateTime="2026-12-01"
          location="Paris, France"
        />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 max-sm:*:flex-1">
          <Button disabled className="whitespace-nowrap opacity-55 md:w-fit">
            Tickets coming soon
          </Button>
        </div>
      </Hero>
      <AboutSection />
      <div className="gql-container gql-conf-navbar-strip text-neu-900 before:bg-white/40 before:dark:bg-blk/30">
        <WhyAttendSection />
        <BecomeASpeakerSection />
        <EventPartnersSection />
        <CtaCardSection
          title="Stay tuned"
          description="Join us for a day of GraphQL talks, networking, and hands-on learning at FOST Paris."
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
