import "server-only"

// @ts-expect-error - we already have it in transitive deps and I want to avoid having a duplicate
import { evaluate } from "@mdx-js/mdx"
import * as runtime from "react/jsx-runtime"

/**
 * Nextra's builtin MDX support requires jumping out to a Client component
 * (and creating new file) and we don't really need that for everything.
 *
 * Sometimes we want to grab some markdown without all the remark and rehype
 * plugins configured by Nextra.
 */
export async function ServerComponentMarkdown({
  markdown,
  components = {},
}: {
  markdown: string
  components?: Record<string, React.ComponentType>
}) {
  try {
    const { default: Mdx } = await evaluate(markdown, {
      ...runtime,
      useMDXComponents: (arg: typeof components) => {
        return {
          ...components,
          ...arg,
        }
      },
    })
    return Mdx()
  } catch (error) {
    console.error(error)
    return (
      <div>{error instanceof Error ? error.message : "Error loading MDX"}</div>
    )
  }
}
