import { readFile, writeFile } from "node:fs/promises"
import { fileURLToPath, pathToFileURL } from "node:url"
import { dirname, resolve } from "node:path"
import { fetchRepoContributors } from "./fetch-repo-contributors.ts"
import * as logger from "./logger.ts"
import { readState, writeState } from "./state.ts"

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
const outPath = resolve(__dirname, "../data.json")

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
  options: {
    forceRefresh?: boolean
    onProgress?: (data: { page: number; repoSlug: string }) => void
    onContributorFound?: (
      contributor: Contributor & { project: string },
    ) => void
  } = {},
): Promise<ContributorsForProjects> {
  const accessToken = process.env.GITHUB_ACCESS_TOKEN
  if (!accessToken) {
    logger.warn(
      "No GITHUB_ACCESS_TOKEN environment variable found. Skipping contributors sync.",
    )
    return {}
  }

  let existingData: ContributorsForProjects = {}
  try {
    existingData = JSON.parse(await readFile(outPath, "utf8"))
  } catch (error) {
    logger.log("No existing data.json found, starting fresh.")
  }

  const perProject = new Map<string, Map<string, Contributor>>()
  for (const projectName in existingData) {
    const projectMap = new Map<string, Contributor>()
    for (const contributor of existingData[projectName]) {
      projectMap.set(contributor.id, contributor)
    }
    perProject.set(projectName, projectMap)
  }

  const state = await readState()
  const repos = Object.keys(repoToProject) as RepoRef[]

  for (const fullName of repos) {
    const repoState = state.repositories[fullName]
    if (repoState?.status === "completed" && !options.forceRefresh) {
      logger.log(`Skipping ${fullName}, already completed.`)
      continue
    }

    const project = repoToProject[fullName]
    const [owner, name] = fullName.split("/") as [string, string]

    try {
      const counts = await fetchRepoContributors(
        owner,
        name,
        accessToken,
        state,
        options,
      )

      if (options.onContributorFound) {
        for (const [login, info] of counts) {
          options.onContributorFound({
            project,
            id: login,
            contributions: info.contributions,
            website: info.website,
          })
        }
      }

      let projectMap = perProject.get(project)
      if (!projectMap) {
        projectMap = new Map()
        perProject.set(project, projectMap)
      }

      for (const [login, info] of counts) {
        const existing = projectMap.get(login)
        if (existing) {
          existing.contributions += info.contributions
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
      logger.warn(`Failed to fetch contributors for ${fullName}:`, err)
      state.repositories[fullName] = {
        ...state.repositories[fullName],
        status: "error",
      }
      await writeState(state)
    }
  }

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
  const options = {
    forceRefresh: process.argv.includes("--force"),
  }

  const onProgress = (data: { page: number; repoSlug: string }) => {
    process.stderr.write(
      `Fetching commits for ${data.repoSlug}: page ${data.page}`,
    )
  }

  const onContributorFound = (
    contributor: Contributor & { project: string },
  ) => {
    console.log(JSON.stringify(contributor))
  }

  getContributors(REPO_TO_PROJECT, {
    ...options,
    onProgress,
    onContributorFound,
  })
    .then(async data => {
      process.stderr.write("\n")
      await writeFile(outPath, JSON.stringify(data, null, 2) + "\n", "utf8")
      logger.log(
        `Wrote ${Object.values(data).reduce(
          (n, arr) => n + arr.length,
          0,
        )} contributors across ${
          Object.keys(data).length
        } projects to ${outPath}`,
      )
    })
    .catch(err => {
      process.stderr.write("\n")
      logger.error("Failed to write contributors data.json:", err)
      process.exitCode = 1
    })
}
