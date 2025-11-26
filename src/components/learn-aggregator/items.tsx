import meta from "../../pages/learn/_meta"

type LearnPagePath = Exclude<keyof typeof meta, `-- ${string}` | "index">

interface LearnPageItem {
  title: string
  description: string
  icon: string
  section: "getting-started" | "best-practices"
}

const _items: Record<LearnPagePath, Omit<LearnPageItem, "title"> | null> = {
  introduction: {
    description:
      "Get a high-level overview of GraphQL and how it enables flexible, versionless APIs powered by a strong type system.",
    icon: new URL("./icons/computer.svg", import.meta.url).href,
    section: "getting-started",
  },
  schema: {
    description:
      "Learn the elements of the GraphQL type system and how schemas describe your data and relationships.",
    icon: new URL("./icons/hierarchy.svg", import.meta.url).href,
    section: "getting-started",
  },
  queries: {
    description:
      "Use query operations to fetch exactly the data you need from a GraphQL server.",
    icon: new URL("./icons/search.svg", import.meta.url).href,
    section: "getting-started",
  },
  mutations: {
    description:
      "See how mutation operations write data and when side effects are allowed in GraphQL.",
    icon: new URL("./icons/construction.svg", import.meta.url).href,
    section: "getting-started",
  },
  subscriptions: {
    description:
      "Get real-time updates from a GraphQL server with long-lived subscription operations.",
    icon: new URL("./icons/sync-square.svg", import.meta.url).href,
    section: "getting-started",
  },
  validation: {
    description:
      "Validate operations against your schema to catch issues before execution.",
    icon: new URL("./icons/product-check.svg", import.meta.url).href,
    section: "getting-started",
  },
  execution: {
    description:
      "Understand how GraphQL resolves fields during execution to fulfill client requests.",
    icon: new URL("./icons/board.svg", import.meta.url).href,
    section: "getting-started",
  },
  response: {
    description:
      "Learn how GraphQL responses mirror queries, include data, and surface errors.",
    icon: new URL("./icons/share.svg", import.meta.url).href,
    section: "getting-started",
  },
  introspection: {
    description:
      "Ask a schema about its types and fields using GraphQL's introspection system.",
    icon: new URL("./icons/zoom-page.svg", import.meta.url).href,
    section: "getting-started",
  },
  // ---
  "best-practices": {
    description:
      "Practical guidance for networking, authorization, pagination, and other everyday GraphQL concerns.",
    icon: new URL("./icons/books.svg", import.meta.url).href,
    section: "best-practices",
  },
  "thinking-in-graphs": {
    description:
      "Model your business domain as a graph and use schemas to express connected types.",
    icon: new URL("./icons/layer.svg", import.meta.url).href,
    section: "best-practices",
  },
  "serving-over-http": {
    description:
      "Follow HTTP guidelines to respond to GraphQL queries and mutations over the web.",
    icon: new URL("./icons/globe.svg", import.meta.url).href,
    section: "best-practices",
  },
  "file-uploads": {
    description:
      "Understand why file uploads are tricky in GraphQL and safer patterns to support them.",
    icon: new URL("./icons/note.svg", import.meta.url).href,
    section: "best-practices",
  },
  authorization: {
    description:
      "Design authorization in your schema to control which users can access specific data.",
    icon: new URL("./icons/key.svg", import.meta.url).href,
    section: "best-practices",
  },
  pagination: {
    description:
      "Paginate lists and connections so clients can traverse large graphs efficiently.",
    icon: new URL("./icons/menu.svg", import.meta.url).href,
    section: "best-practices",
  },
  "schema-design": {
    description:
      "Evolve schemas without versioning while keeping types clear and future-friendly.",
    icon: new URL("./icons/cog-double.svg", import.meta.url).href,
    section: "best-practices",
  },
  "global-object-identification": {
    description:
      "Expose global object IDs so clients can refetch, cache, and reference data reliably.",
    icon: new URL("./icons/dna.svg", import.meta.url).href,
    section: "best-practices",
  },
  caching: {
    description:
      "Use identifiers and response patterns that enable effective caching for GraphQL clients and servers.",
    icon: new URL("./icons/sync-square.svg", import.meta.url).href,
    section: "best-practices",
  },
  performance: {
    description:
      "Optimize GraphQL requests and implementations for fast, efficient performance.",
    icon: new URL("./icons/startup.svg", import.meta.url).href,
    section: "best-practices",
  },
  security: {
    description:
      "Protect GraphQL APIs against common attack vectors with layered security practices.",
    icon: new URL("./icons/safe.svg", import.meta.url).href,
    section: "best-practices",
  },
  federation: {
    description:
      "Compose multiple services into a single graph using GraphQL federation.",
    icon: new URL("./icons/globe.svg", import.meta.url).href,
    section: "best-practices",
  },
  "debug-errors": {
    description:
      "Identify common HTTP and GraphQL errors and debug them effectively.",
    icon: new URL("./icons/solve.svg", import.meta.url).href,
    section: "best-practices",
  },
}

export const learnPages = _items as Record<LearnPagePath, LearnPageItem | null>

for (const path in learnPages) {
  const page = learnPages[path as LearnPagePath]
  if (page === null) continue
  const metaEntry = meta[path as keyof typeof meta]

  if (typeof metaEntry === "string") {
    page.title =
      metaEntry ||
      path.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
  } else if (typeof metaEntry === "object" && "title" in metaEntry) {
    page.title = metaEntry.title
  } else {
    page.title = path.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
  }
}
