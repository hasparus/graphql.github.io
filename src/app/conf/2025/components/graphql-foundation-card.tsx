import { clsx } from "clsx"

import FoundationWordmark from "../assets/graphql-foundation-wordmark.svg?svgr"

export function GraphQLFoundationCard({ className }: { className?: string }) {
  return (
    <section className={clsx("gql-conf-section", className)}>
      <div className="flex divide-neu-300 border border-neu-300 bg-neu-100 dark:divide-neu-100 dark:border-neu-100 dark:bg-neu-50 max-md:flex-col max-md:divide-y md:divide-x">
        <div className="items-center px-8 py-10 md:px-16 md:py-24">
          <FoundationWordmark className="mx-auto h-[68px] text-pri-base dark:text-pri-light md:h-[100px] [&_g]:fill-current" />
        </div>
        <p className="text-pretty px-8 py-10 typography-body-lg max-md:text-center md:px-16 md:py-24">
          GraphQLConf is presented by the GraphQL Foundation, uniting the global
          GraphQL community to promote education, adoption, and advancement of
          GraphQL.
        </p>
      </div>
    </section>
  )
}
