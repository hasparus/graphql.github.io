import { useRef } from "react"
import { useInView } from "motion/react"
import dynamic from "next/dynamic"

import { Button } from "@/app/conf/_design-system/button"
import { SectionLabel } from "@/app/conf/_design-system/section-label"
import {
  HowItWorks_Schema,
  HowItWorks_Query,
  HowItWorks_Result,
} from "@/components/code-blocks"

import { HowItWorksListItem } from "./how-it-works-list-item"
import { PlayButton } from "./play-button"

const InteractiveEditor = dynamic(() => import("./interactive-editor"), {
  ssr: false,
})

const TRY_IT_OUT_URL = "https://graphql.org/swapi-graphql"

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  // todo: we could technically consider loading the chunk on hover or focus,
  // just so people scrolling through the page don't download CodeMirror
  const inView = useInView(sectionRef)

  return (
    <section
      ref={sectionRef}
      className="gql-container gql-section xl:py-20"
      // this is mostly for Playwright, we're not getting a hydration warning normally
      suppressHydrationWarning
    >
      <SectionLabel className="mb-6">How it works</SectionLabel>
      <h2 className="typography-h2 mb-6 lg:mb-16">A GraphQL Query</h2>
      <div className="relative">
        <ol className="gql-radial-gradient list-none gap-px max-md:bg-gradient-to-r max-md:from-transparent max-md:via-neu-400 max-md:to-transparent lg:grid lg:grid-cols-3">
          <HowItWorksListItem
            text="Describe your data"
            code={<HowItWorks_Schema />}
          />
          <HowItWorksListItem
            text="Ask for what you want"
            icon={<PlayButton disabled={inView} />}
            code={<HowItWorks_Query />}
          />
          <HowItWorksListItem
            text="Get predictable results"
            code={<HowItWorks_Result />}
          />
        </ol>
        {inView && (
          <ol
            // this is rendered *on top* of the static version to avoid layout shift
            className="absolute inset-0 list-none gap-px lg:grid lg:grid-cols-3"
          >
            <div className="pointer-events-none" />
            <InteractiveEditor />
          </ol>
        )}
      </div>

      <Button className="mx-auto mt-8 w-fit lg:mt-16" href={TRY_IT_OUT_URL}>
        Try GraphiQL
      </Button>
    </section>
  )
}
