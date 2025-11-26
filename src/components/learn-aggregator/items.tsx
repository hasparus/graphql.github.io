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
    description: "",
    icon: "",
    section: "getting-started",
  },
  schema: {
    description: "",
    icon: "",
    section: "getting-started",
  },
  queries: {
    description: "",
    icon: "",
    section: "getting-started",
  },
  mutations: {
    description: "",
    icon: "",
    section: "getting-started",
  },
  subscriptions: {
    description: "",
    icon: "",
    section: "getting-started",
  },
  validation: {
    description: "",
    icon: "",
    section: "getting-started",
  },
  execution: {
    description: "",
    icon: "",
    section: "getting-started",
  },
  response: {
    description: "",
    icon: "",
    section: "getting-started",
  },
  introspection: {
    description: "",
    icon: "",
    section: "getting-started",
  },
  // ---
  "best-practices": {
    description: "",
    icon: "",
    section: "best-practices",
  },
  "thinking-in-graphs": {
    description: "",
    icon: "",
    section: "best-practices",
  },
  "serving-over-http": {
    description: "",
    icon: "",
    section: "best-practices",
  },
  "file-uploads": {
    description: "",
    icon: "",
    section: "best-practices",
  },
  authorization: {
    description: "",
    icon: "",
    section: "best-practices",
  },
  pagination: {
    description: "",
    icon: "",
    section: "best-practices",
  },
  "schema-design": {
    description: "",
    icon: "",
    section: "best-practices",
  },
  "global-object-identification": {
    description: "",
    icon: "",
    section: "best-practices",
  },
  caching: {
    description: "",
    icon: "",
    section: "best-practices",
  },
  performance: {
    description: "",
    icon: "",
    section: "best-practices",
  },
  security: {
    description: "",
    icon: "",
    section: "best-practices",
  },
  federation: {
    description: "",
    icon: "",
    section: "best-practices",
  },
  "debug-errors": {
    description: "",
    icon: "",
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
