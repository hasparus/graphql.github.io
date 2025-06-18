import type { Metadata } from "next"
import clsx from "clsx"

import { Anchor } from "@/app/conf/_design-system/anchor"
import { ServerComponentMarkdown } from "@/app/conf/_components/server-component-markdown"
import { Button } from "@/app/conf/_design-system/button"

import { NavbarPlaceholder } from "../components/navbar"
import "../resources/prose.css"

import markdown from "./code-of-conduct.mdx?raw"
import { Hero } from "../components/hero"

export const metadata: Metadata = {
  title: "Code of Conduct | GraphQLConf 2025",
}

export default function ResourcesPage() {
  return (
    <>
      <NavbarPlaceholder className="top-0 bg-neu-0 before:bg-white/30 dark:bg-neu-0 dark:before:bg-blk/40" />
      <Hero pageName="Code of conduct" subtitle="The Linux Foundation" colorScheme="neutral">
        <Button
          href="https://events.linuxfoundation.org/about/code-of-conduct/"
          className="mt-[18px] w-fit"
        >
          See on The Linux Foundation
        </Button>
      </Hero>
      <main className="gql-all-anchors-focusable gql-conf-navbar-strip text-neu-900 before:bg-white/40 before:dark:bg-blk/30">
        <div className="gql-conf-container gql-conf-section gql-prose">
          <ServerComponentMarkdown
            markdown={markdown}
            components={{
              a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
                return (
                  <Anchor
                    {...props}
                    href={props.href ?? ""}
                    className={clsx(props.className, "typography-link")}
                  />
                )
              },
              ul: (props: React.HTMLAttributes<HTMLUListElement>) => {
                return (
                  <ul {...props} className={clsx(props.className, "-mt-6")} />
                )
              },
              Callout: (props: React.HTMLAttributes<HTMLDivElement>) => {
                return (
                  <div
                    {...props}
                    className={clsx(
                      props.className,
                      "gql-prose-inner -mx-4 w-fit border border-neu-300 bg-neu-50 p-4 xl:my-4",
                    )}
                  />
                )
              },
            }}
          />
        </div>
      </main>
    </>
  )
}
