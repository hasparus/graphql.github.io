import NextLink from "next/link"

import { Tag } from "@/app/conf/_design-system/tag"

import { blogTagColors } from "./blog-tag-colors"
import { BlogCard } from "./blog-card"
import { LookingForMore } from "./looking-for-more"
import { NavbarPlaceholder } from "@/app/conf/2025/components/navbar"

export interface BlogPageProps {
  tags: Record<string, number>
  blogs: BlogMdxContent[]
  currentTag: string
}

interface BlogMdxContent {
  route: string
  frontMatter: {
    title: string
    tags: string[]
    byline: string
    date: Date
  }
}

export function BlogPage({ tags, blogs, currentTag }: BlogPageProps) {
  return (
    <main className="gql-all-anchors-focusable bg-neu-0">
      <div className="relative top-[calc(var(--nextra-navbar-height)*-1)] bg-gradient-to-b from-sec-base to-neu-0 pt-[var(--nextra-navbar-height)]">
        <header className="gql-container gql-section">
          <h1 className="typography-h1 text-center">The GraphQL Blog</h1>
          <p className="typography-body-sm mt-4 text-center lg:mt-8">
            Insights, updates and best practices from across the GraphQL
            community. Stay connected with the ideas and innovations shaping the
            GraphQL ecosystem.
          </p>
          <RecentBlogPosts />
        </header>
      </div>
      <div className="gql-container">
        <div className="gql-section">
          <section className="flex items-center justify-between gap-2">
            <h2 className="typography-h2 [text-box:trim-both_cap_alphabetic]">
              {currentTag || "All Posts"}
            </h2>
            <section>
              <h3 className="typography-menu">Categories</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {Object.entries(tags)
                  .sort((a, b) => b[1] - a[1])
                  .map(([tag, count]) => (
                    <NextLink
                      key={tag}
                      href={currentTag === tag ? "/blog" : `/tags/${tag}`}
                      data-active={currentTag === tag ? "" : undefined}
                      className="flex"
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
                  <BlogCard frontMatter={page.frontMatter} key={page.route} />
                ),
            )}
          </section>
        </div>
        <LookingForMore />
      </div>
    </main>
  )
}
