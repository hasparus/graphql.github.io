import { Hero } from "./hero"
import { TrustedBy } from "./trusted-by"
import { SingleRequest } from "./single-request"
import { BringYourOwnCode } from "./bring-your-own-code"
import { WhoIsUsing } from "./who-is-using"
import { HowItWorks } from "./how-it-works"
import { ProvenSolution } from "./proven-solution"
import { FivePillars } from "./five-pillars"
import { PoweredByCommunity } from "./powered-by-community"
import { GraphQLAdvantages } from "./graphql-advantages"

export function IndexPage() {
  return (
    <div className="bg-neu-0">
      <Hero />
      <TrustedBy />
      <HowItWorks />
      <ProvenSolution />
      <FivePillars />
      <PoweredByCommunity />
      <GraphQLAdvantages />
      <section className="conf-block container flex max-w-3xl flex-col items-center text-center">
        <h2>A query language for your API</h2>
        <p>
          GraphQL is a query language for APIs and a runtime for fulfilling
          those queries with your existing data. GraphQL provides a complete and
          understandable description of the data in your API, gives clients the
          power to ask for exactly what they need and nothing more, makes it
          easier to evolve APIs over time, and enables powerful developer tools.
        </p>
      </section>
      <SingleRequest />
      <BringYourOwnCode />
      <WhoIsUsing />
    </div>
  )
}
