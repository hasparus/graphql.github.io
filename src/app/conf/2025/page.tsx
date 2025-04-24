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
      </div>
      <div className="container my-20 flex flex-col gap-20 md:my-32 md:gap-32">
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
