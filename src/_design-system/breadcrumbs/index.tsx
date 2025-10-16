import { Fragment } from "react"
import { clsx } from "clsx"
import NextLink from "next/link"
import { ArrowRightIcon } from "nextra/icons"
import type { Item } from "nextra/normalize-pages"

import { extractStringsFromReactNode } from "../../components/utils/extract-strings-from-react-node"

export const Breadcrumbs = ({ activePath }: { activePath: Item[] }) => {
  return (
    <div className="x:mt-1.5 x:flex x:items-center x:gap-1 x:overflow-hidden x:text-sm x:text-gray-600 x:dark:text-gray-400 x:contrast-more:text-current">
      {activePath.map((item, index, arr) => {
        const nextItem = arr[index + 1]
        const href = nextItem
          ? "frontMatter" in item
            ? item.route
            : (item as { children: { route: string }[] }).children[0]?.route ===
                nextItem.route
              ? ""
              : (item as { children: { route: string }[] }).children[0]?.route
          : ""

        const title = extractStringsFromReactNode(item.title)
        const className = clsx(
          "x:whitespace-nowrap x:transition-colors",
          nextItem
            ? "x:min-w-6 x:overflow-hidden x:text-ellipsis"
            : "x:font-medium x:text-black x:dark:text-gray-100",
          href &&
            "x:focus-visible:nextra-focus x:ring-inset x:hover:text-gray-900 x:dark:hover:text-gray-100",
        )

        return (
          <Fragment key={item.route + item.name}>
            {index > 0 && (
              <ArrowRightIcon
                height="14"
                className="x:shrink-0 x:rtl:rotate-180"
              />
            )}
            {href ? (
              <NextLink href={href} title={title} prefetch={false}>
                {item.title}
              </NextLink>
            ) : (
              <span className={className} title={title}>
                {item.title}
              </span>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
