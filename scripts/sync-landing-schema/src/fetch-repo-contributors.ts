import { setTimeout as sleep } from "node:timers/promises"
import { execute } from "./execute.ts"
import { QUERY } from "./query.ts"

/**
 * Fetch contributors (by commit authors tied to GitHub users) for a single repo.
 * Traverses the full commit history of the default branch using pagination.
 */
export async function fetchRepoContributors(
  owner: string,
  repo: string,
  accessToken: string,
) {
  const contributors = new Map<
    string /* handle */,
    { contributions: number; website?: string }
  >()
  let after: string | null = null
  let page = 0
  let hasMore = true

  const fetchMore = () =>
    execute(
      QUERY,
      {
        owner,
        name: repo,
        after,
      },
      {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "graphql.org contributors sync client",
      },
    )

  while (hasMore) {
    const response = await fetchMore()

    if (response.errors?.length) {
      throw new Error(
        `GitHub GraphQL errors for ${owner}/${repo}: ${response.errors
          .map((e: { message: string }) => e.message)
          .join("; ")}`,
      )
    }

    const repoData = response.data?.repository
    if (!repoData) {
      console.warn(`Repository not found: ${owner}/${repo}`)
      break
    }

    const defaultBranchRef = repoData.defaultBranchRef
    if (!defaultBranchRef?.target) {
      console.warn(`Default branch not found for ${owner}/${repo}`)
      break
    }

    if (!("history" in defaultBranchRef.target)) {
      console.warn(`History not found for ${owner}/${repo}`)
      break
    }

    const history = defaultBranchRef.target.history

    for (const node of history.nodes || []) {
      const user = node?.author?.user
      if (!user?.login) continue
      const prev = contributors.get(user.login)
      if (prev) {
        prev.contributions += 1
        // keep existing website unless we don't have one and GitHub provides it
        prev.website ||= user.websiteUrl
      } else {
        contributors.set(user.login, {
          contributions: 1,
          website: user.websiteUrl ?? undefined,
        })
      }
    }

    const hasNext = history.pageInfo?.hasNextPage
    after = history.pageInfo?.endCursor || null
    hasMore = !!hasNext
    page += 1

    if (page % 5 === 0) await sleep(200)
  }

  return contributors
}
