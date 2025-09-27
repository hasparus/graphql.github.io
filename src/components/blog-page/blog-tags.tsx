import { Tag } from "@/app/conf/_design-system/tag"

import { blogTagColors } from "./blog-tag-colors"

export function BlogTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex gap-2">
      {tags.map(tag => {
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
  )
}
