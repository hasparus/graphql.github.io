import { NextRequest, NextResponse } from "next/server"
import contributorData from "../../../../scripts/sync-landing-schema/data.json"

interface Contributor {
  id: string
  website?: string | null
  contributions: number
}

interface ContributorData {
  [repository: string]: Contributor[]
}

function getContributorData(): ContributorData {
  return contributorData as ContributorData
}

export async function GET(request: NextRequest) {
  const headers = new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=172800",
  })

  try {
    const { searchParams } = new URL(request.url)
    const first = Math.max(
      1,
      Math.min(100, parseInt(searchParams.get("first") || "20")),
    )
    const after = searchParams.get("after") || ""
    const repository = searchParams.get("repository") || ""

    const data = getContributorData()

    // Flatten all contributors
    const allContributors: Contributor[] = []

    for (const [repoName, contributors] of Object.entries(data)) {
      if (
        !repository ||
        repoName.toLowerCase().includes(repository.toLowerCase())
      ) {
        allContributors.push(...contributors)
      }
    }

    // Sort by contributions (descending), then by id for stable sorting
    allContributors.sort((a, b) => {
      if (b.contributions !== a.contributions) {
        return b.contributions - a.contributions
      }
      return a.id.localeCompare(b.id)
    })

    // Find starting index based on cursor (contributor id)
    let startIndex = 0
    if (after) {
      const afterIndex = allContributors.findIndex(
        contributor => contributor.id === after,
      )
      if (afterIndex >= 0) {
        startIndex = afterIndex + 1
      }
    }

    // Get the requested slice
    const endIndex = Math.min(startIndex + first, allContributors.length)
    const paginatedContributors = allContributors.slice(startIndex, endIndex)

    return NextResponse.json(paginatedContributors, { headers })
  } catch (error) {
    console.error("Error in contributors API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch contributors data",
      },
      {
        status: 500,
        headers,
      },
    )
  }
}
