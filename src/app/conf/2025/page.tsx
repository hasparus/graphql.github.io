import { Metadata } from "next"
import { HostedByGraphQLFoundation } from "@/icons"
import { GridButton } from "../_components/grid-button"
import { Sponsor } from "./sponsorship"
import { Venue } from "./venue"
import { FAQ } from "./faq"
import { Register } from "./register"
import { Sponsors } from "./sponsors"
import { Speakers } from "./speakers"
import { RegisterToday } from "./components/register-today"
import { Hero } from "./components/hero"
import WhatToExpectSection from "./components/what-to-expect"
import TopMindsSection from "./components/top-minds"

export const metadata: Metadata = {
  title: "GraphQLConf 2025 — Sept 08-10",
}

export default function Page() {
  return (
    <main>
      <Hero />
      <div className="gql-conf-container mx-auto">
        <RegisterToday className="md:mb-8 md:mt-24" />
        <WhatToExpectSection className="md:mb-8 md:mt-24" />
        <TopMindsSection className="md:mb-8 md:mt-24" hasSpeakersPage={false} />
      </div>
      <div className="container my-20 flex flex-col gap-20 md:my-32 md:gap-32 [.light_&_.text-white]:text-neu-900 [.light_&_[alt='Grafbase_logo']]:invert">
        <Sponsors />
        <Sponsor />
        <Speakers />
        <Register />
        <Venue />
        <FAQ />
      </div>
    </main>
  )
}
