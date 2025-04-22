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

export const metadata: Metadata = {
  title: "GraphQLConf 2025 — Sept 08-10",
}

function Intro() {
  return (
    <section className="flex flex-col gap-20 md:gap-32">
      <h2 className="text-3xl font-normal lg:text-5xl">
        Celebrating 10 Years of GraphQL. Three transformative days of expert
        insights and innovation to shape the next decade of APIs together!
      </h2>

      <GridButton
        title="Get Tickets"
        href="https://cvent.me/PBNYEe?utm_source=graphql_conf_2025&utm_medium=website&utm_campaign=cta"
      />
    </section>
  )
}

export default function Page() {
  return (
    <main>
      <Hero />
      <div className="mx-auto max-w-[90rem]">
        <RegisterToday className="my-8 md:mb-16 md:mt-24" />
      </div>
      <div className="container my-20 flex flex-col gap-20 md:my-32 md:gap-32">
        <Intro />
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
