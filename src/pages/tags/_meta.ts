import { createCatchAllMeta } from "nextra/catch-all"
import { getStaticPaths } from "./[slug].mdx"

export default () => {
  // This is logging an error
  // `Attempted import error: 'getStaticPaths' is not exported from './[slug].mdx'`
  // but the pages work?
  const { paths } = getStaticPaths() as unknown as {
    paths: { params: { slug: string } }[]
  }

  const options = {
    display: "hidden",
  }

  return createCatchAllMeta(
    paths.map(p => "/" + p.params.slug),
    Object.fromEntries(paths.map(p => [p.params.slug, options])),
  )
}
