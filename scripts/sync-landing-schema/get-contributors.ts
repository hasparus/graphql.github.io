import { setTimeout as sleep } from "timers/promises"
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath, pathToFileURL } from "node:url"
import { dirname, resolve } from "node:path"
import { graphql } from "./generated"
import { ExecutionResult } from "graphql"
import { TypedDocumentString } from "./generated/graphql"

type RepoRef = `${string}/${string}`

const QUERY = graphql(`
  query RepoContributors($owner: String!, $name: String!, $after: String) {
    repository(owner: $owner, name: $name) {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 100, after: $after) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                author {
                  user {
                    login
                    websiteUrl
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`)

export const REPO_TO_PROJECT: Record<RepoRef, string> = {
  "graphql/graphql-spec": "GraphQL",
  "graphql/graphql-wg": "GraphQL",
  "graphql/graphql-js": "graphql-js",
  "graphql/graphiql": "GraphiQL",
}

/**
 * Fetch contributors for the repos listed in REPO_TO_PROJECT and aggregate by project.
 * - Uses GitHub GraphQL API (v4) with a personal access token in env GITHUB_ACCESS_TOKEN
 * - Aggregates contributors across multiple repos that map to the same project
 * - Sorts contributors per project by contributions (desc)
 *
 * Returns a map: { [projectName]: Array<{ id, website?, contributions }> }
 */
export async function getContributors(
  repoToProject: Record<RepoRef, string> = REPO_TO_PROJECT,
): Promise<ExecutionResult<typeof QUERY>> {
  const accessToken = process.env.GITHUB_ACCESS_TOKEN
  if (!accessToken) {
    console.warn(
      "No GITHUB_ACCESS_TOKEN environment variable found. Skipping contributors sync.",
    )
    return {}
  }

  // Aggregate contributors per project
  const perProject = new Map<
    string,
    Map<
      string,
      {
        id: string
        website?: string
        contributions: number
      }
    >
  >()

  // Fetch each repo in parallel (a little stagger to be nice to rate limits)
  const repos = Object.keys(repoToProject) as RepoRef[]

  await Promise.all(
    repos.map(async (fullName, i) => {
      const project = repoToProject[fullName]
      // Exponential-ish tiny backoff per parallel slot to reduce throttling
      if (i) await sleep(Math.min(50 * i, 500))

      const [owner, name] = fullName.split("/") as [string, string]

      try {
        const counts = await fetchRepoContributors(owner, name, accessToken)

        let projectMap = perProject.get(project)
        if (!projectMap) {
          projectMap = new Map()
          perProject.set(project, projectMap)
        }

        for (const [login, info] of counts) {
          const existing = projectMap.get(login)
          if (existing) {
            existing.contributions += info.contributions
            // Prefer first available website if we don't have one yet
            if (!existing.website && info.website) {
              existing.website = info.website
            }
          } else {
            projectMap.set(login, {
              id: login,
              website: info.website,
              contributions: info.contributions,
            })
          }
        }
      } catch (err) {
        console.warn(`Failed to fetch contributors for ${fullName}:`, err)
      }
    }),
  )

  // Convert to the requested output shape and sort by contributions
  const result: ExecutionResult<typeof QUERY> = {}
  for (const [project, map] of perProject) {
    const arr = Array.from(map.values()).sort(
      (a, b) => b.contributions - a.contributions,
    )
    result[project] = arr
  }
  return result
}

/**
 * Fetch contributors (by commit authors tied to GitHub users) for a single repo.
 * Traverses the full commit history of the default branch using pagination.
 *
 * Returns a Map: login -> { contributions, website }
 */
async function fetchRepoContributors(
  owner: string,
  repo: string,
  accessToken: string,
) {
  // login -> { contributions, website }
  const counts = new Map<string, { contributions: number; website?: string }>()
  let after: string | null = null
  let page = 0
  let hasMore = true

  while (hasMore) {
    const response = await execute(QUERY, {
      owner,
      name: repo,
      after,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'graphql.org contributors sync client',
      },
    })

    if (response.errors?.length) {
      throw new Error(
        `GitHub GraphQL errors for ${owner}/${repo}: ${response.errors
          .map((e: { message: string }) => e.message)
          .join("; ")}`,
      )
    }

    const repoDataRaw = response.data?[0].
    if (!repoDataRaw) {
      console.warn(`Repository not found: ${owner}/${repo}`)
      break
    }
    const repoData = repoDataRaw as NonNullable<RepoHistoryPage["repository"]>

    const defaultBranchRef = repoData.defaultBranchRef
    if (!defaultBranchRef || !defaultBranchRef.target) {
      console.warn(`Default branch not found for ${owner}/${repo}`)
      break
    }
    const history = defaultBranchRef.target.history

    for (const node of history.nodes) {
      const user = node.author?.user
      if (!user?.login) continue
      const prev = counts.get(user.login)
      if (prev) {
        prev.contributions += 1
        // keep existing website unless we don't have one and GitHub provides it
        if (!prev.website && user.websiteUrl) prev.website = user.websiteUrl
      } else {
        counts.set(user.login, {
          contributions: 1,
          website: user.websiteUrl ?? undefined,
        })
      }
    }

    const hasNext = history.pageInfo.hasNextPage
    after = history.pageInfo.endCursor
    hasMore = hasNext
    page += 1

    // Brief backoff every few pages to be nicer to the API
    if (page % 5 === 0) await sleep(200)
  }

  return counts
}

// CLI entrypoint: when executed directly, write contributors to data.json next to this file
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const outPath = resolve(__dirname, "data.json")
  getContributors()
    .then(data => {
      writeFileSync(outPath, JSON.stringify(data, null, 2) + "\n", "utf8")
      console.log(
        `Wrote ${Object.values(data).reduce((n, arr) => n + arr.length, 0)} contributors across ${Object.keys(data).length} projects to ${outPath}`,
      )
    })
    .catch(err => {
      console.error("Failed to write contributors data.json:", err)
      process.exitCode = 1
    })
}

async function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  headers?: Record<string, string>,
  variables?: TVariables,
) {
  const response = await fetch("https://graphql.org/graphql/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/graphql-response+json",
      ...headers,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  if (!response.ok) {
    throw new Error("Network response was not ok")
  }

  return response.json() as ExecutionResult<TResult>
}
