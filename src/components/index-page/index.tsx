import { Hero } from "./hero"
import { TrustedBy } from "./trusted-by"
import { BringYourOwnCode } from "./bring-your-own-code"
import { HowItWorks } from "./how-it-works"
import { ProvenSolution } from "./proven-solution"
import { FivePillars } from "./five-pillars"
import { PoweredByCommunity } from "./powered-by-community"
import { GraphQLAdvantages } from "./graphql-advantages"
import { QuotesFromTheIndustry } from "./quotes-from-the-industry"
import { JoinTheCommunity } from "./join-the-community"

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
      <QuotesFromTheIndustry />
      <JoinTheCommunity />
    </div>
  )
}
