import { useConfig } from "nextra-theme-docs"
import NextLink from "next/link"
import { Tag } from "../../app/conf/_design-system/tag"
import { blogTagColors } from "../../components/blog-page/blog-tag-colors"

export default {
  // only for blog posts inside folders we need to specify breadcrumb title
  "2024-06-11-announcing-new-graphql-website": "Announcing New GraphQL Website",
  "2025-07-17-graphiql-5": "GraphiQL 5 Release; Press F1!",
  "*": {
    display: "hidden",
    theme: {
      sidebar: false,
      timestamp: true,
      layout: "default",
      topContent: function TopContent() {
        const { frontMatter } = useConfig()
        const { title, byline, tags } = frontMatter
        const date = new Date(frontMatter.date)
        return (
          <>
            <div className="mt-8 flex gap-4">
              {tags.map((tag: string) => (
                <NextLink
                  key={tag}
                  href={`/tags/${tag}`}
                  className="-m-1 flex p-1 ring-inset ring-neu-400 transition-opacity duration-75 hover:ring focus:!outline-offset-0 dark:ring-neu-50 [:has(>:hover)>&:not(:hover)]:opacity-70"
                >
                  <Tag color={blogTagColors[tag]}>
                    {tag.replaceAll("-", " ")}
                  </Tag>
                </NextLink>
              ))}
            </div>
            <h1 className="typography-d1 !mt-3 text-balance !text-left">
              {title}
            </h1>
            <div className="typography-menu flex flex-col justify-center gap-2">
              <span>{byline}</span>
              <time
                dateTime={date.toISOString()}
                className="text-neu-700 dark:text-neu-400"
              >
                {date.toLocaleDateString("en", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </div>
          </>
        )
      },
    },
  },
}
