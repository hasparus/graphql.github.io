import { getMdxHeadings } from "./get-mdx-headings"
import { MdxLink } from "./mdx-link"

export const mdxComponents = {
  a: MdxLink,
  ...getMdxHeadings(),
}
