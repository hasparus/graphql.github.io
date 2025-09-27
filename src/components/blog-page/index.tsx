import NextLink from "next/link"

import { Tag } from "@/app/conf/_design-system/tag"
import { arrowsMoveSideways } from "@/app/conf/_design-system/utils/arrows-move-sideways"

import { blogTagColors } from "./blog-tag-colors"
import { BlogCard } from "./blog-card"
import { LookingForMore } from "./looking-for-more"
import { BlogMdxContent } from "./mdx-types"
import { FeaturedBlogPosts } from "./featured-blog-posts"

export interface BlogPageProps {
  tags: Record<string, number>
  blogs: BlogMdxContent[]
  currentTag: string
}

export function BlogPage({ tags, blogs, currentTag }: BlogPageProps) {
  return (
    <main className="gql-all-anchors-focusable bg-neu-0">
      <div className="relative top-[calc(var(--nextra-navbar-height)*-1)] bg-gradient-to-b from-sec-base to-neu-0 pt-[var(--nextra-navbar-height)] dark:from-sec-darker">
        <header className="gql-container gql-section lg:pt-24">
          <h1 className="typography-h1 text-center">The GraphQL Blog</h1>
          <p className="typography-body-sm mt-4 text-center lg:mt-8">
            Insights, updates and best practices from across the GraphQL
            community. Stay connected with the ideas and innovations shaping the
            GraphQL ecosystem.
          </p>
          <FeaturedBlogPosts blogs={blogs} className="mt-24 max-md:hidden" />
        </header>
      </div>
      <div className="gql-container">
        <div className="gql-section">
          <section className="flex items-end justify-between gap-2">
            <h2 className="typography-h2 capitalize">
              {currentTag || "All Posts"}
            </h2>
            <section>
              <h3 className="typography-menu">Categories</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {Object.entries(tags)
                  .sort((a, b) => b[1] - a[1])
                  .map(([tag, count], i) => (
                    <NextLink
                      key={tag}
                      href={currentTag === tag ? "/blog" : `/tags/${tag}`}
                      data-active={currentTag === tag ? "" : undefined}
                      tabIndex={i === 0 ? 0 : -1}
                      className="-m-1 flex p-1 ring-inset ring-neu-400 transition-opacity duration-75 hover:ring focus:!outline-offset-0 dark:ring-neu-50 [:has(>:hover)>&:not(:hover)]:opacity-70"
                      onKeyDown={arrowsMoveSideways}
                    >
                      <Tag color={blogTagColors[tag]}>
                        {tag.replaceAll("-", " ")} ({count})
                      </Tag>
                    </NextLink>
                  ))}
              </ul>
            </section>
          </section>
          <section className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(368px,1fr))] gap-4 md:mt-8 lg:mt-16 lg:gap-6">
            {blogs.map(
              page =>
                (!currentTag || page.frontMatter.tags.includes(currentTag)) && (
                  <BlogCard key={page.route} {...page} />
                ),
            )}
          </section>
        </div>
        <LookingForMore />
      </div>
    </main>
  )
}
