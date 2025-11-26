import meta from "../../pages/learn/_meta"

type LearnPagePath = Exclude<keyof typeof meta, `-- ${string}` | "index">

function getTitle(path: LearnPagePath): string {
  const entry = meta[path as keyof typeof meta]
  if (typeof entry === "string") {
    return (
      entry || path.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    )
  } else if (typeof entry === "object" && "title" in entry) {
    return entry.title
  }
  return path.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
}

export const learnPages: Record<
  LearnPagePath,
  {
    title: string
    description: string
    icon: string
    section: "getting-started" | "best-practices"
  } | null
> = {
  introduction: {
    title: getTitle("introduction"),
    description: "",
    icon: "",
    section: "getting-started",
  },
  schema: {
    title: getTitle("schema"),
    description: "",
    icon: "",
    section: "getting-started",
  },
  queries: {
    title: getTitle("queries"),
    description: "",
    icon: "",
    section: "getting-started",
  },
  mutations: {
    title: getTitle("mutations"),
    description: "",
    icon: "",
    section: "getting-started",
  },
  subscriptions: {
    title: getTitle("subscriptions"),
    description: "",
    icon: "",
    section: "getting-started",
  },
  validation: {
    title: getTitle("validation"),
    description: "",
    icon: "",
    section: "getting-started",
  },
  execution: {
    title: getTitle("execution"),
    description: "",
    icon: "",
    section: "getting-started",
  },
  response: {
    title: getTitle("response"),
    description: "",
    icon: "",
    section: "getting-started",
  },
  introspection: {
    title: getTitle("introspection"),
    description: "",
    icon: "",
    section: "getting-started",
  },
  // ---
  "best-practices": {
    title: getTitle("best-practices"),
    description: "",
    icon: "",
    section: "best-practices",
  },
  "thinking-in-graphs": {
    title: getTitle("thinking-in-graphs"),
    description: "",
    icon: "",
    section: "best-practices",
  },
  "serving-over-http": {
    title: getTitle("serving-over-http"),
    description: "",
    icon: "",
    section: "best-practices",
  },
  "file-uploads": {
    title: getTitle("file-uploads"),
    description: "",
    icon: "",
    section: "best-practices",
  },
  authorization: {
    title: getTitle("authorization"),
    description: "",
    icon: "",
    section: "best-practices",
  },
  pagination: {
    title: getTitle("pagination"),
    description: "",
    icon: "",
    section: "best-practices",
  },
  "schema-design": {
    title: getTitle("schema-design"),
    description: "",
    icon: "",
    section: "best-practices",
  },
  "global-object-identification": {
    title: getTitle("global-object-identification"),
    description: "",
    icon: "",
    section: "best-practices",
  },
  caching: {
    title: getTitle("caching"),
    description: "",
    icon: "",
    section: "best-practices",
  },
  performance: {
    title: getTitle("performance"),
    description: "",
    icon: "",
    section: "best-practices",
  },
  security: {
    title: getTitle("security"),
    description: "",
    icon: "",
    section: "best-practices",
  },
  federation: {
    title: getTitle("federation"),
    description: "",
    icon: "",
    section: "best-practices",
  },
  // ---
  // omitted on Learn index page
  "debug-errors": null,
}
