import { Button } from "@/app/conf/_design-system/button"
import { SectionLabel } from "@/app/conf/_design-system/section-label"

export function ProvenSolution() {
  return (
    <section className="gql-container gql-section xl:py-20">
      <SectionLabel className="mb-6">Business perspective</SectionLabel>
      <h2 className="typography-h2 mb-6 lg:mb-16">
        A proven solution for startups and enterprises
      </h2>

      <Button className="mx-auto mt-8 w-fit lg:mt-16" href="/learn">
        Learn more
      </Button>
    </section>
  )
}
