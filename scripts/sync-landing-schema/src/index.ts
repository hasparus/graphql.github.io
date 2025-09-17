import { setTimeout as sleep } from "node:timers/promises"
import { readFile, writeFile } from "node:fs/promises"
import { fileURLToPath, pathToFileURL } from "node:url"
import { dirname, resolve } from "node:path"
import { fetchRepoContributors } from "./fetch-repo-contributors.ts"

type RepoRef = `${string}/${string}`
interface Contributor {
  id: string
  website?: string
  contributions: number
}
type ContributorsForProjects = {
  [projectName: string]: Contributor[]
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = resolve(__dirname, "data.json")

export const REPO_TO_PROJECT: Record<RepoRef, string> = {
  // "graphql/graphql-spec": "GraphQL",
  // "graphql/graphql-wg": "GraphQL",
  // "graphql/graphql-js": "graphql-js",
  "graphql/graphiql": "GraphiQL",
}

/**
 * Fetch contributors for the repos listed in REPO_TO_PROJECT and aggregate by project.
 * - Uses GitHub GraphQL API (v4) with a personal access token in env GITHUB_ACCESS_TOKEN
 * - Aggregates contributors across multiple repos that map to the same project
 * - Sorts contributors per project by contributions (desc)
 */
export async function getContributors(
  repoToProject: Record<RepoRef, string> = REPO_TO_PROJECT,
): Promise<ContributorsForProjects> {
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
  const result: Record<
    string,
    Array<{ id: string; website?: string; contributions: number }>
  > = {}
  for (const [project, map] of perProject) {
    const arr = Array.from(map.values()).sort(
      (a, b) => b.contributions - a.contributions,
    )
    result[project] = arr
  }
  return result
}

// CLI entrypoint: when executed directly, write contributors to data.json next to this file
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  getContributors()
    .then(async data => {
      await writeFile(outPath, JSON.stringify(data, null, 2) + "\n", "utf8")
      console.log(
        `Wrote ${Object.values(data).reduce((n, arr) => n + arr.length, 0)} contributors across ${Object.keys(data).length} projects to ${outPath}`,
      )
    })
    .catch(err => {
      console.error("Failed to write contributors data.json:", err)
      process.exitCode = 1
    })
}
