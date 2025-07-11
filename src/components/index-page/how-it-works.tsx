import { ChevronRight } from "@/app/conf/_design-system/pixelarticons/chevron-right"
import { Button } from "@/app/conf/_design-system/button"

import { CodeA, CodeB, CodeC } from "../code-blocks"

const TRY_IT_OUT_URL = "https://graphql.org/swapi-graphql"

export function HowItWorks() {
  return (
    <section className="gql-container gql-section xl:py-20">
      <span className="mb-6 flex w-[80px] shrink-0 items-center gap-1 self-start whitespace-nowrap font-mono text-sm/none font-normal uppercase text-pri-base">
        <ChevronRight className="shrink-0 translate-y-[-0.5px]" />
        How it works
      </span>
      <h2 className="typography-h2 mb-6 lg:mb-16">A GraphQL Query</h2>
      <ol className="list-none">
        <ListItem text="Describe your data" code={<CodeA />} />
        <ListItem text="Ask for what you want" code={<CodeB />} />
        <ListItem text="Get predictable results" code={<CodeC />} />
      </ol>

      <Button className="mx-auto mt-8 w-fit lg:mt-16" href={TRY_IT_OUT_URL}>
        Try it out live
      </Button>
    </section>
  )
}

function ListItem({
  text,
  code,
}: {
  text: React.ReactNode
  code: React.ReactNode
}) {
  return (
    <li className="typography-body-md pt-4 [counter-increment:list-item] before:typography-body-sm before:mr-2 before:inline-flex before:size-5 before:translate-y-[-0.5px] before:items-center before:justify-center before:bg-neu-200 before:p-1 before:text-neu-800 before:content-[counter(list-item)] lg:pt-6">
      {text}
      <div className="mt-4 lg:mt-6">{code}</div>
    </li>
  )
}
