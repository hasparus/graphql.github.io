import { CodegenConfig } from "@graphql-codegen/cli"
import { readdir, readFile, writeFile } from "node:fs/promises"

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
        enumsAsTypes: true,
      },
    },
  },
  hooks: {
    afterAllFileWrite: async () => {
      const dir = await readdir("./generated")
      await Promise.all(
        dir.map(async file => {
          let content = await readFile(`./generated/${file}`, "utf8")

          // add .ts extension to imports
          content = content
            .replace(/from\s+['"](\.[^'"]*?)(?<!\.ts)['"];?/g, 'from "$1.ts";')
            .replace(
              /import\(\s*['"](\.[^'"]*?)(?<!\.ts)['"]\s*\)/g,
              'import("$1.ts")',
            )

          // switch type-only modules to type import
          content = content.replace(
            /import\s+({[^}]+})\s+from\s+['"]@graphql-typed-document-node\/core['"];?/g,
            'import type $1 from "@graphql-typed-document-node/core";',
          )

          await writeFile(`./generated/${file}`, content)
        }),
      )
    },
  },
}

export default config
