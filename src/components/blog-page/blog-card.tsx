import { Tag } from "@/app/conf/_design-system/tag"

import ArrowDown from "@/app/conf/_design-system/pixelarticons/arrow-down.svg?svgr"
import { blogTagColors } from "./blog-tag-colors"
import clsx from "clsx"
import { Button } from "@/app/conf/_design-system/button"

export interface BlogCardProps extends React.HTMLAttributes<HTMLElement> {
  frontMatter: {
    title: string
    date: Date
    tags: string[]
    byline: string
  }
}

export function BlogCard({ frontMatter, className, ...rest }: BlogCardProps) {
  return (
    <article className={clsx(className, "flex flex-col")} {...rest}>
      <BlogCardPicture>
        <div className="flex gap-2">
          {frontMatter.tags.map(tag => {
            const color = blogTagColors[tag]
            if (!color) {
              throw new Error(`No color found for tag: ${tag}`)
            }
            return (
              <Tag color={color} key={tag}>
                {tag.replaceAll("-", " ")}
              </Tag>
            )
          })}
        </div>
      </BlogCardPicture>
      <div className="flex grow flex-col border border-neu-200 dark:border-neu-50">
        <div className="typography-body-lg grow text-pretty p-4">
          {frontMatter.title}
        </div>
        <footer className="flex justify-between">
          <div className="typography-menu flex flex-col gap-2 p-4">
            <span>{frontMatter.byline}</span>
            <time dateTime={frontMatter.date.toISOString()}>
              {frontMatter.date.toLocaleDateString("en", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
          <div className="translate-x-px translate-y-px border-l border-t border-neu-200 p-4 dark:border-neu-50">
            <ArrowDown className="-rotate-90" />
          </div>
        </footer>
      </div>
    </article>
  )
}

function BlogCardPicture({ children }: { children: React.ReactNode }) {
  return <div className="aspect-[2.23] bg-neu-50 p-4">{children}</div>
}
