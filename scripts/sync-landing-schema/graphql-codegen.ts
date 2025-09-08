import { CodegenConfig } from "@graphql-codegen/cli"

if (!process.env.GITHUB_ACCESS_TOKEN) {
  throw new Error("GITHUB_ACCESS_TOKEN environment variable is not set")
}

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    "https://api.github.com/graphql": {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        "User-Agent": "graphql.org contributors sync script",
      },
    },
  },
  documents: ["./*.ts"],
  generates: {
    "./generated/": {
      preset: "client",
      config: {
        documentMode: "string",
      },
    },
  },
}

export default config
