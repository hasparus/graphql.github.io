import * as React from "react"
import { clsx } from "clsx"
import { Code } from "nextra/components"
import {
  cloneElement,
  ComponentPropsWithoutRef,
  ReactElement,
  useRef,
} from "react"

import { Pre } from "@/components/pre"
import { SectionLabel } from "@/app/conf/_design-system/section-label"
import InfoIcon from "@/app/conf/_design-system/pixelarticons/info.svg?svgr"

import { ComponentTree } from "./component-tree"
import { FriendList } from "./friend-list"

import json from "./data-colocation.json"
import Query from "./data-colocation.mdx"
import "./data-colocation.css"
import { useOnClickOutside } from "@/app/conf/_design-system/utils/useOnClickOutside"

const highlightedFragments = {
  GetFriendList: 1,
  FriendList: 2,
  FriendListItem: 3,
  FriendInfo: 4,
}

const components = {
  pre: (props: ComponentPropsWithoutRef<typeof Pre>) => (
    <Pre
      {...props}
      // todo: this bg style might need to become global for all code blocks
      className={clsx(
        props.className,
        "sector-opacity !border-none pr-4 leading-[1.459em] backdrop-blur-[6px] max-xs:leading-[16px] max-xs:[&_span]:!text-xs",
      )}
      tabIndex={-1}
    />
  ),
  code: ({ children, ...rest }: ComponentPropsWithoutRef<typeof Code>) => {
    let sectorIndex: number | undefined
    let depth = 0

    if (children) {
      children = React.Children.map(children, child => {
        if (isSpanElement(child)) {
          let children = (child as ReactElement).props.children

          if (isSpanElement(children)) {
            children = children.props.children
          } else if (Array.isArray(children)) {
            children = children
              .map(child => {
                if (isSpanElement(child)) {
                  return child.props.children
                }
                return child
              })
              .join("")
          }

          if (/query|fragment/.test(children)) {
            for (const [name, index] of Object.entries(highlightedFragments)) {
              if (children.includes(` ${name} `)) sectorIndex = index
              depth++
            }
          }

          if (children.includes("{")) depth++
          if (children.includes("}")) {
            depth--
            if (depth === 0) sectorIndex = undefined
          }

          if (sectorIndex) {
            return cloneElement(child, {
              ...child.props,
              "data-sector": sectorIndex,
            } as React.HTMLAttributes<HTMLSpanElement>)
          }

          return child
        }

        return child
      })
    }
    return <Code {...rest}>{children}</Code>
  },
}

function isSpanElement(
  child: React.ReactNode,
): child is ReactElement<{ children: React.ReactNode }> {
  return (
    typeof child === "object" &&
    !!child &&
    (child as ReactElement).type === "span"
  )
}

export function DataColocation() {
  const markSector = (event: React.MouseEvent<HTMLElement>) => {
    const target =
      event.target && event.target instanceof HTMLElement ? event.target : null

    const sectorElement = target?.closest("[data-sector]") as HTMLElement | null
    const sector = sectorElement?.dataset.sector

    if (!sector) return

    const currentTarget = event.currentTarget

    if (currentTarget.dataset.activeSector !== sector) {
      currentTarget.dataset.activeSector = sector
    }
  }

  const unmarkSector = (event: React.MouseEvent<HTMLElement>) => {
    console.log("unmarkSector", window.matchMedia("(hover: none)").matches)
    if (window.matchMedia("(hover: none)").matches) return

    const target =
      event.relatedTarget && event.relatedTarget instanceof HTMLElement
        ? event.relatedTarget
        : null

    const currentTarget = event.currentTarget

    const sectorElement = target?.closest("[data-sector]") as HTMLElement | null
    const targetSector = sectorElement?.dataset.sector
    const currentActiveSector = currentTarget.dataset.activeSector

    if (!targetSector) {
      delete currentTarget.dataset.activeSector
      return
    }

    if (!currentActiveSector) return

    currentTarget.dataset.activeSector = targetSector
  }

  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, event => {
    console.log("clicked outside")
    if (event.currentTarget && event.currentTarget instanceof HTMLElement) {
      delete event.currentTarget.dataset.activeSector
    }
  })

  return (
    <section
      ref={ref}
      className="gql-container gql-section flex flex-wrap justify-between gap-4 sm:max-xl:gap-y-8 xl:p-24"
      onMouseOver={markSector}
      onMouseOut={unmarkSector}
      onPointerDown={markSector}
    >
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
          <div className="sector-ring">
            <FriendList friends={json.friends} />
          </div>
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
    <div className="flex w-full grow gap-2 hover-none:items-center xl:max-w-[240px]">
      <InfoIcon className="size-4 shrink-0 hover-hover:size-5 hover-hover:translate-y-[0.5px]" />
      <p className="typography-body-sm text-neu-800">
        <span className="hover-hover:hidden">Click on</span>
        <span className="hover-none:hidden">Hover over</span> the components to
        see their GraphQL fragments.
      </p>
    </div>
  )
}
