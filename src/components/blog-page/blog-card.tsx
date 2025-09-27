import { clsx } from "clsx"
import { Tag } from "@/app/conf/_design-system/tag"
import NextLink from "next/link"

import ArrowDown from "@/app/conf/_design-system/pixelarticons/arrow-down.svg?svgr"
import { Button } from "@/app/conf/_design-system/button"

import { BlogTags } from "./blog-tags"

export interface BlogCardProps extends React.HTMLAttributes<HTMLElement> {
  frontMatter: {
    title: string
    date: Date
    tags: string[]
    byline: string
  }
  route: string
}

export function BlogCard({
  route,
  frontMatter,
  className,
  ...rest
}: BlogCardProps) {
  return (
    <article
      className={clsx(
        className,
        "relative flex flex-col bg-neu-0 ring-inset ring-neu-400 hover:ring-1 dark:ring-neu-100",
      )}
      {...rest}
    >
      <BlogCardPicture className="aspect-[2.23]">
        <BlogTags tags={frontMatter.tags} />
      </BlogCardPicture>
      <div className="flex grow flex-col border border-neu-200 dark:border-neu-50">
        <div className="typography-body-lg grow text-pretty p-4">
          {frontMatter.title}
        </div>
        <footer className="mt-auto flex justify-between">
          <BlogCardFooterContent
            byline={frontMatter.byline}
            date={frontMatter.date}
            className="p-4"
          />
          <BlogCardArrow className="translate-x-px translate-y-px border-l border-t border-neu-200 p-4 dark:border-neu-50" />
        </footer>
      </div>
      <NextLink href={route} className="absolute inset-0" />
    </article>
  )
}

export function BlogCardPicture({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return <div className={clsx("bg-neu-50 p-4", className)}>{children}</div>
}

export function BlogCardArrow({ className }: { className?: string }) {
  return (
    <div className={className}>
      <ArrowDown className="-rotate-90" />
    </div>
  )
}

export function BlogCardFooterContent({
  byline,
  date,
  className,
}: {
  byline: string
  date: Date
  className?: string
}) {
  return (
    <div className={clsx("typography-menu flex flex-col gap-2", className)}>
      <span>{byline}</span>
      <time dateTime={date.toISOString()} className="text-neu-700">
        {date.toLocaleDateString("en", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </time>
    </div>
  )
}
