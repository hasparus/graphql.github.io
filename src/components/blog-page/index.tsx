import NextLink from "next/link"

import { Tag } from "@/app/conf/_design-system/tag"
import { blogTagColors } from "./blog-tag-colors"
import { BlogCard } from "./blog-card"

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
    <>
      <div className="">
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
                >
                  <Tag color={blogTagColors[tag]}>
                    {tag.replaceAll("-", " ")} ({count})
                  </Tag>
                </NextLink>
              ))}
          </ul>
        </section>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(368px,1fr))] gap-4">
        {blogs.map(
          page =>
            (!currentTag || page.frontMatter.tags.includes(currentTag)) && (
              <BlogCard frontMatter={page.frontMatter} key={page.route} />
            ),
        )}
      </div>
    </>
  )
}
