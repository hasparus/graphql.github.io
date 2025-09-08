import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} from "graphql"

const PROJECT_NAME = "GraphQL"
const PROJECT_TAGLINE = "A query language for APIs"
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
  website: string
}

const projects: Project[] = [
  {
    name: PROJECT_NAME,
    tagline: PROJECT_TAGLINE,
    website: PROJECT_WEBSITE,
  },
  {
    name: "GraphiQL",
    tagline: "Ecosystem for building browser & IDE tools.",
    website: "https://github.com/graphql/graphiql",
  },
  {
    name: "graphql-js",
    tagline: "A reference implementation of GraphQL for JavaScript",
    website: "https://graphql.org/graphql-js/",
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
