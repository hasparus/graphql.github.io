import dynamic from "next/dynamic"
import { StarWarsSchema } from "./swapi-schema"
import { UsersSchema } from "./users-schema"

const SCHEMA_MAP = {
  StarWars: StarWarsSchema,
  Users: UsersSchema,
} as const

type SchemaKey = keyof typeof SCHEMA_MAP

type Metadata = {
  graphiql?: boolean
  variables?: unknown
  schema?: SchemaKey
}

const MiniGraphiQL = dynamic(() => import("./mini-graphiQL"), { ssr: true })

export function Marked({ children }: { children: string }) {
  const codeMatch = children.match(/```graphql\s*\n([\s\S]*?)```/)
  const blockContent = codeMatch?.[1]
  const [firstLine, ...rest] = (blockContent || "").split("\n")

  const metaMatch = firstLine.match(/^\s*#\s*({.*})\s*$/)?.[1] ?? "{}"
  const meta = JSON.parse(metaMatch) as Metadata

  const query = rest.join("\n")
  const variables = meta.variables
    ? JSON.stringify(meta.variables, null, 2)
    : ""
  const schema = SCHEMA_MAP[meta.schema ?? "StarWars"]

  return <MiniGraphiQL schema={schema} query={query} variables={variables} />
}
