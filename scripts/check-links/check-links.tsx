#!/usr/bin/env tsx

import React, { useState, useEffect, useCallback } from "react"
import { render, Text, Box, Newline, useInput } from "ink"
import { LinkChecker, type LinkResult } from "linkinator"
import { writeFile } from "fs/promises"
import { join } from "path"

const parseArgs = () => {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    throw new Error(
      "No URL provided. Please provide a URL as a command line argument.",
    )
  }
  return args[0]
}

interface LinksByParent {
  [parent: string]: LinkResult[]
}

interface State {
  currentPage?: string
  scannedLinks: LinkResult[]
  totalPages: number
  isComplete: boolean
  result?: any
}

const urlToCheck = parseArgs()

const generateDiffableTree = (scannedLinks: LinkResult[]): string => {
  const linksByParent: LinksByParent = {}
  scannedLinks.forEach(link => {
    const parent = link.parent || "Root"
    if (!linksByParent[parent]) {
      linksByParent[parent] = []
    }
    linksByParent[parent].push(link)
  })

  const sortedParents = Object.keys(linksByParent).sort()
  const lines: string[] = []

  lines.push(`# Link Check Results for ${urlToCheck}`)
  lines.push(`Generated: ${new Date().toISOString()}`)
  lines.push("")

  sortedParents.forEach((parent, parentIndex) => {
    const links = linksByParent[parent].sort((a, b) =>
      a.url.toString().localeCompare(b.url.toString()),
    )
    const isLast = parentIndex === sortedParents.length - 1

    lines.push(`${parentIndex === 0 ? "📁" : isLast ? "└─" : "├─"} ${parent}`)

    links.forEach((link, linkIndex) => {
      const isLastLink = linkIndex === links.length - 1
      const prefix = isLast ? "    " : "│   "
      const linkPrefix = isLastLink ? "└── " : "├── "

      let icon: string
      switch (link.state) {
        case "BROKEN":
          icon = "❌"
          break
        case "OK":
          icon = "✅"
          break
        default:
          icon = "⚠️"
      }

      // Make URLs relative if they start with urlToCheck
      let displayUrl = link.url.toString()
      if (displayUrl.startsWith(urlToCheck)) {
        const relativePath = displayUrl.slice(urlToCheck.length)
        displayUrl = relativePath.startsWith("/")
          ? relativePath
          : "/" + relativePath
      }

      lines.push(
        `${prefix}${linkPrefix}${icon} ${displayUrl} (${link.status || "N/A"})`,
      )
    })
  })

  return lines.join("\n")
}

const startTime = new Date()

const saveResultsToFile = async (scannedLinks: LinkResult[], result: any) => {
  const treeContent = generateDiffableTree(scannedLinks)
  const outputPath = join(
    process.cwd(),
    `${startTime.toISOString().replace(/[:.]/g, "-")}-link-check-results.txt`,
  )

  const summary = [
    `Status: ${result?.passed !== undefined ? (result.passed ? "COMPLETED - PASSED" : "COMPLETED - FAILED") : "IN PROGRESS"}`,
    `Last updated: ${new Date().toISOString()}`,
    `Total links scanned: ${scannedLinks.length}`,
    `Broken links: ${scannedLinks.filter(link => link.state === "BROKEN").length}`,
    `OK links: ${scannedLinks.filter(link => link.state === "OK").length}`,
    "",
    treeContent,
  ].join("\n")

  await writeFile(outputPath, summary, "utf8")
  return outputPath
}

const App = () => {
  const [state, setState] = useState<State>({
    scannedLinks: [],
    totalPages: 0,
    isComplete: false,
  })
  const [lastSaveTime, setLastSaveTime] = useState<string>("")

  const performAutosave = useCallback(async () => {
    try {
      await saveResultsToFile(state.scannedLinks, state.result)
      setLastSaveTime(new Date().toLocaleTimeString())
    } catch (error) {
      console.error("Autosave failed:", error)
    }
  }, [state.scannedLinks, state.result])

  useInput((input, _key) => {
    if (input === "s" || input === "S") {
      performAutosave()
    } else if (input === "e" || input === "E") {
      process.exit(0)
    }
  })

  // Set up autosave timer
  useEffect(() => {
    const autosaveInterval = setInterval(performAutosave, 30000) // 30 seconds
    return () => clearInterval(autosaveInterval)
  }, [performAutosave])

  useEffect(() => {
    const checkLinks = async () => {
      const checker = new LinkChecker()

      checker.on("pagestart", url => {
        setState(prev => ({
          ...prev,
          currentPage: url,
          totalPages: prev.totalPages + 1,
        }))
      })

      checker.on("link", result => {
        setState(prev => ({
          ...prev,
          scannedLinks: [...prev.scannedLinks, result],
        }))
      })

      try {
        const result = await checker.check({
          path: urlToCheck,
          recurse: true,
          retry: true,
          timeout: 1000 * 60 * 2, // 2 minutes
          linksToSkip: [
            // this is a redirect to flickr
            "https://graphql.org/conf/2024/gallery/",
            // todo: we should also avoid the redirect to graphql-js so we don't check its relative links
            // alternatively, we can validate the links in html but then we'll have to have some edge cases for redirects too
          ],
        })

        setState(prev => {
          const newState = {
            ...prev,
            isComplete: true,
            result,
          }
          // Save final results
          saveResultsToFile(newState.scannedLinks, result)
          return newState
        })
      } catch (err) {
        setState(prev => {
          const newState = {
            ...prev,
            isComplete: true,
            result: { passed: false, error: err },
          }
          // Save error results
          saveResultsToFile(newState.scannedLinks, {
            passed: false,
            error: err,
          })
          return newState
        })
      }
    }

    checkLinks()
  }, [])

  const renderTree = () => {
    if (!state.isComplete || !state.result) return null

    const linksByParent: LinksByParent = {}
    state.scannedLinks.forEach(link => {
      const parent = link.parent || "Root"
      if (!linksByParent[parent]) {
        linksByParent[parent] = []
      }
      linksByParent[parent].push(link)
    })

    const sortedParents = Object.keys(linksByParent).sort()

    return (
      <Box flexDirection="column">
        <Text color="cyan" bold>
          📊 Link Check Results Tree:
        </Text>
        <Newline />

        {sortedParents.map((parent, parentIndex) => {
          const links = linksByParent[parent].sort((a, b) =>
            a.url.toString().localeCompare(b.url.toString()),
          )
          const isLast = parentIndex === sortedParents.length - 1

          return (
            <Box key={parent} flexDirection="column">
              <Text color="blue" bold>
                {parentIndex === 0 ? "📁" : isLast ? "└─" : "├─"} {parent}
              </Text>

              {links.map((link, linkIndex) => {
                const isLastLink = linkIndex === links.length - 1
                const prefix = isLast ? "    " : "│   "
                const linkPrefix = isLastLink ? "└── " : "├── "

                let color: string
                let icon: string

                switch (link.state) {
                  case "BROKEN":
                    color = "red"
                    icon = "❌"
                    break
                  case "OK":
                    color = "green"
                    icon = "✅"
                    break
                  default:
                    color = "yellow"
                    icon = "⚠️"
                }

                return (
                  <Text key={link.url.toString()} color={color}>
                    {prefix}
                    {linkPrefix}
                    {icon} {link.url.toString()} ({link.status || "N/A"})
                  </Text>
                )
              })}
            </Box>
          )
        })}
      </Box>
    )
  }

  const brokenLinks = state.scannedLinks.filter(link => link.state === "BROKEN")
  const okLinks = state.scannedLinks.filter(link => link.state === "OK")

  return (
    <Box flexDirection="column" marginX={1}>
      <Text color="blue">
        🎯 Checking URL:{" "}
        <Text color="white" bold>
          {urlToCheck.toString()}
        </Text>
      </Text>

      <Box flexDirection="column">
        <Text color="cyan">
          📄 Pages scanned:{" "}
          <Text color="white" bold>
            {state.totalPages}
          </Text>
        </Text>
        <Text color="cyan">
          🔍 Links checked:{" "}
          <Text color="white" bold>
            {state.scannedLinks.length}
          </Text>
        </Text>

        {state.scannedLinks.length > 0 && (
          <Box flexDirection="row" gap={2}>
            <Text color="green">
              ✅ OK: <Text bold>{okLinks.length}</Text>
            </Text>
            <Text color="red">
              ❌ Broken: <Text bold>{brokenLinks.length}</Text>
            </Text>
          </Box>
        )}

        {lastSaveTime && (
          <Text color="gray">💾 Last saved: {lastSaveTime}</Text>
        )}

        <Text color="gray">💡 Press 'S' to save now, 'E' to exit</Text>
      </Box>

      {state.isComplete && state.result && (
        <Box flexDirection="column">
          <Text color={state.result.passed ? "green" : "red"} bold>
            🎯 Final Result: {state.result.passed ? "PASSED" : "FAILED"}
          </Text>
          {renderTree()}
        </Box>
      )}

      {!state.isComplete && (
        <Text color="yellow">⏳ Scanning in progress...</Text>
      )}

      {!!state.currentPage && !state.isComplete && (
        <Text color="yellow">
          🔄 Currently scanning:{" "}
          <Text color="white">{`${state.currentPage}`}</Text>
        </Text>
      )}
    </Box>
  )
}

render(<App />, {
  exitOnCtrlC: true,
})
