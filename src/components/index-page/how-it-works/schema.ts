import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt,
  GraphQLID,
} from "graphql"

const PROJECT_NAME = "GraphQL"
const PROJECT_TAGLINE = "A query language for APIs"

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

/**
 * NOTE:
 * Contributors data will be synced from scripts/sync-landing-schema/data.json
 * and should provide GitHub handles and (optionally) websites for each user.
 */
interface User {
  id: string
  website?: string
}

interface Project {
  name: string
  tagline: string
}

const projects: Project[] = [
  {
    name: PROJECT_NAME,
    tagline: PROJECT_TAGLINE,
  },
  {
    name: "GraphiQL",
    tagline: "Ecosystem for building browser & IDE tools.",
  },
  {
    name: "graphql-js",
    tagline: "A reference implementation of GraphQL for JavaScript",
  },
]

const UserType = new GraphQLObjectType<User>({
  name: "User",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "GitHub handle of the contributor",
    },
    website: {
      type: GraphQLString,
      description: "Personal website of the contributor",
    },
  },
})

function getContributorsForProject(
  project: Project,
  opts: { first?: number; after?: string | null } = {},
): User[] {
  // TODO: Load from scripts/sync-landing-schema/data.json once available
  const all: User[] = []
  const { first, after } = opts

  let startIndex = 0
  if (after) {
    const idx = all.findIndex(u => u.id === after)
    if (idx === -1) {
      return []
    }
    startIndex = idx + 1
  }

  const sliced = all.slice(startIndex)
  if (typeof first === "number" && first >= 0) {
    return sliced.slice(0, first)
  }
  return sliced
}

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
    contributors: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      description: "List of contributors to the project",
      args: {
        first: {
          type: GraphQLInt,
          description: "Limits the number of contributors returned",
        },
        after: {
          type: GraphQLID,
          description: "Cursor (User.handle) after which to start",
        },
      },
      resolve: (project, args) => {
        return getContributorsForProject(project, {
          first: args?.first,
          after: args?.after ?? null,
        })
      },
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
