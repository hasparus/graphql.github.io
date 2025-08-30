import { Button } from "@/app/conf/_design-system/button"
import { SectionLabel } from "@/app/conf/_design-system/section-label"
import { CodeA, CodeB, CodeC } from "../../code-blocks"

import { useRef } from "react"
import { useInView } from "motion/react"
import { HowItWorksListItem } from "./how-it-works-list-item"
import dynamic from "next/dynamic"
import { PlayButton } from "./play-button"

const InteractiveEditor = dynamic(import("./interactive-editor"), {
  ssr: false,
})

const TRY_IT_OUT_URL = "https://graphql.org/swapi-graphql"

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef)

  return (
    <section ref={sectionRef} className="gql-container gql-section xl:py-20">
      <SectionLabel className="mb-6">How it works</SectionLabel>
      <h2 className="typography-h2 mb-6 lg:mb-16">A GraphQL Query</h2>
      <ol className="gql-radial-gradient list-none gap-px max-md:bg-gradient-to-r max-md:from-transparent max-md:via-neu-400 max-md:to-transparent lg:grid lg:grid-cols-3">
        <HowItWorksListItem text="Describe your data" code={<CodeA />} />
        {/* TODO: There's a blink on transition. We need to mount the new editor before unmounting the old one. */}
        {inView ? (
          <InteractiveEditor />
        ) : (
          <>
            <HowItWorksListItem
              text="Ask for what you want"
              icon={<PlayButton />}
              code={<CodeB />}
            />
            <HowItWorksListItem
              text="Get predictable results"
              code={<CodeC />}
            />
          </>
        )}
      </ol>

      <Button className="mx-auto mt-8 w-fit lg:mt-16" href={TRY_IT_OUT_URL}>
        Try GraphiQL
      </Button>
    </section>
  )
}
