import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} from "graphql"

const PROJECT_NAME = "GraphQL"
const PROJECT_TAGLINE = "A query language for APIs"
const PROJECT_DESCRIPTION =
  "GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data."
const PROJECT_WEBSITE = "https://graphql.org"

export const INITIAL_QUERY_TEXT = `{
  project(name: "${PROJECT_NAME}") {
    tagline
  }
}`

export const INITIAL_RESULTS_TEXT = `{
  "project": {
    "tagline": "${PROJECT_TAGLINE}"
  }
}`

interface Project {
  name: string
  tagline: string
  description: string
  website: string
}

const projects: Project[] = [
  {
    name: PROJECT_NAME,
    tagline: PROJECT_TAGLINE,
    description: PROJECT_DESCRIPTION,
    website: PROJECT_WEBSITE,
  },
  {
    name: "GraphiQL",
    tagline: "Ecosystem for building browser & IDE tools.",
    description:
      "GraphiQL is the reference implementation of this monorepo, GraphQL IDE, an official project under the GraphQL Foundation. The code uses the permissive MIT license.",
    website: "https://github.com/graphql/graphiql",
  },
]

const ProjectType = new GraphQLObjectType<Project>({
  name: "Project",
  fields: {
    name: {
      type: GraphQLString,
      description: "The name of the project",
    },
    tagline: {
      type: GraphQLString,
      description: "A short description of what the project does",
    },
    description: {
      type: GraphQLString,
      description: "A detailed description of the project",
    },
    website: {
      type: GraphQLString,
      description: "The project website URL",
    },
  },
})

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    project: {
      type: ProjectType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
          description: "The name of the project to retrieve",
        },
      },
      resolve: (_, args) => {
        return projects.find(
          project => project.name.toLowerCase() === args.name.toLowerCase(),
        )
      },
    },
    projects: {
      type: new GraphQLList(ProjectType),
      description: "Get all available projects",
      resolve: () => projects,
    },
  },
})

export const projectsSchema = new GraphQLSchema({
  query: QueryType,
})
