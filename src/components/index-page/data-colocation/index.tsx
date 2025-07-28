import { clsx } from "clsx"
import { Code } from "nextra/components"
import { ComponentPropsWithoutRef } from "react"

import { Pre } from "@/components/pre"
import { SectionLabel } from "@/app/conf/_design-system/section-label"
import InfoIcon from "@/app/conf/_design-system/pixelarticons/info.svg?svgr"

import { ComponentTree } from "./component-tree"
import { FriendList } from "./friend-list"
import json from "./data-colocation.json"
import Query from "./data-colocation.mdx"

const components = {
  pre: (props: ComponentPropsWithoutRef<typeof Pre>) => (
    <Pre
      {...props}
      // todo: this bg style might need to become global for all code blocks
      className={clsx(
        props.className,
        "!border-none pr-4 leading-[1.459em] backdrop-blur-[6px] max-xs:leading-[16px] max-xs:[&_span]:!text-xs",
      )}
      tabIndex={-1}
    />
  ),
  code: Code,
}

export function DataColocation() {
  return (
    <section className="gql-container gql-section flex flex-wrap justify-between gap-4 sm:max-xl:gap-y-8 xl:p-24">
      <div className="shrink">
        <header>
          <SectionLabel>Data Colocation</SectionLabel>
          <h2 className="typography-h2 mt-6">Data Colocation</h2>
          <p className="typography-body-md mt-6 text-pretty xl:max-w-[438px]">
            GraphQL fragments let you reuse common field selections across
            queries, making your code more maintainable and consistent.
          </p>
        </header>
        <ComponentTree
          className="mt-6 md:mt-8 lg:mt-12 xl:mt-16"
          names={[
            "Server",
            "<FriendList>",
            "<FriendListItem>",
            "<FriendInfo/>",
          ]}
        />
      </div>
      <article className="flex flex-wrap divide-neu-100 dark:divide-neu-50 dark:shadow-[0_.5px_20px_0_hsl(0_0_0/.25)] max-xl:w-full max-lg:gap-4 lg:shadow-[0_.5px_20px_0_hsl(var(--color-neu-400))] lg:dark:bg-neu-50/10 xl:divide-x xl:rounded-lg">
        <div className="flex grow flex-col gap-y-4 lg:flex-col-reverse lg:p-4">
          <FigureInfo />
          <FriendList friends={json.friends} />
        </div>
        <div className="flex grow *:w-full *:rounded-lg *:border *:border-neu-100 *:bg-neu-50/50 lg:p-4">
          <Query components={components} />
        </div>
      </article>
    </section>
  )
}

function FigureInfo() {
  return (
    <div className="flex w-full grow gap-2 xl:max-w-[240px]">
      <InfoIcon className="size-5 shrink-0 translate-y-[0.5px]" />
      <p className="typography-body-sm text-neu-800">
        <span className="hover-hover:hidden">Click on</span>
        <span className="hover-none:hidden">Hover over</span> the components to
        see their GraphQL fragments.
      </p>
    </div>
  )
}
