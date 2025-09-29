import { Tag } from "@/app/conf/_design-system/tag"

import { blogTagColors } from "./blog-tag-colors"

export function BlogTags({
  tags,
  opaque,
}: {
  tags: string[]
  opaque?: boolean
}) {
  return (
    <div className="flex gap-2">
      {tags.map(tag => {
        const color = blogTagColors[tag]
        if (!color && process.env.NODE_ENV !== "production") {
          throw new Error(`No color found for tag: ${tag}`)
        }
        return (
          <Tag className={opaque ? "bg-neu-0" : ""} color={color} key={tag}>
            {tag.replaceAll("-", " ")}
          </Tag>
        )
      })}
    </div>
  )
}
