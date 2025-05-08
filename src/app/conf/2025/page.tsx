import { Metadata } from "next"
import { Sponsor } from "./sponsorship"
import { Venue } from "./venue"
import { FAQ } from "./faq"
import { CallForProposals } from "./components/call-for-proposals"
import { RegisterToday } from "./components/register-today"
import { Hero } from "./components/hero"
import WhatToExpectSection from "./components/what-to-expect"
import TopMindsSection from "./components/top-minds"
import { GetYourTicket } from "./components/get-your-ticket"
import { RegisterSection } from "./components/register-section"
import { Sponsors } from "./components/sponsors"

export const metadata: Metadata = {
  title: "GraphQLConf 2025 — Sept 08-10",
}

export default function Page() {
  return (
    <main className="gql-all-anchors-focusable antialiased">
      <Hero />
      <div className="gql-conf-container gql-conf-navbar-strip text-neu-900 before:bg-white/40 before:dark:bg-blk/30">
        <RegisterToday className="md:mb-8 md:mt-24" />
        <WhatToExpectSection className="md:mb-8 md:mt-24" />
        <TopMindsSection className="md:mb-8 md:mt-24" hasSpeakersPage={false} />
      </div>
      <div className="gql-conf-navbar-strip before:bg-white/40 before:dark:bg-pri-dark/[0.45]">
        <GetYourTicket />
      </div>
      <div className="gql-conf-container gql-conf-navbar-strip text-neu-900 before:bg-white/50 before:dark:bg-blk/30">
        <RegisterSection />
        <Sponsors heading="Thanks to our 2024 sponsors!" />
        <CallForProposals />
        <div className="container my-20 flex flex-col gap-20 md:my-32 md:gap-32 [.light_&_.text-white]:text-neu-900 [.light_&_[alt='Grafbase_logo']]:invert">
          <Sponsor />
          <Venue />
        </div>
        <FAQ />
      </div>
    </main>
  )
}
