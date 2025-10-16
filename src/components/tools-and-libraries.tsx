import {
  GitHubIcon,
  GlobeIcon,
  NPMIcon,
  StarIcon,
  RubyGemsIcon,
  ChevronLeftIcon,
} from "@/icons"
import { Card } from "@/components"
import { CheckboxTree, type CheckboxTreeItem } from "@/components/checkbox-tree"
import { useSearchParamsState } from "@/components/checkbox-tree/use-search-params-state"
import NextLink from "next/link"
import NextHead from "next/head"
import { useMounted } from "nextra/hooks"
import Markdown from "markdown-to-jsx"
import { evaluate } from "nextra/components"
import { useCallback, useState, MouseEvent, useMemo, memo } from "react"
import { clsx } from "clsx"
import { Collapse, getComponents } from "nextra-theme-docs"
import { RadioGroup, Radio } from "@/components/radio"
import { Button } from "@/app/conf/_design-system/button"
import { Tag } from "@/app/conf/_design-system/tag"
import SearchIcon from "@/app/conf/_design-system/pixelarticons/search.svg?svgr"
import CaretDown from "@/app/conf/_design-system/pixelarticons/caret-down.svg?svgr"
import { SidebarFooter } from "./sidebar"

type PackageInfo = {
  name: string
  description: string
  url: string
  github: string
  npm: string
  gem?: string
}

type CodePageProps = {
  allTags: {
    tag: string
    count: number
    name: string
  }[]
  data: {
    tags: string[]
    frontMatter: PackageInfo
    stars?: number
    formattedStars?: string
    lastRelease?: string
    license: string
    compiledSource: string
  }[]
}

const TAG_PARAM_KEY = "tags"

export function CodePage({ allTags, data }: CodePageProps) {
  const allTagsMap = useMemo(
    () =>
      new Map(allTags.map(({ tag, count, name }) => [tag, { count, name }])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const [searchParams, setSearchParams] = useSearchParamsState()
  const [search, setSearch] = useState("")
  const normalizedSearch = useMemo(() => search.trim().toLowerCase(), [search])
  const searchTokens = useMemo(
    () =>
      normalizedSearch ? normalizedSearch.split(/\s+/).filter(Boolean) : [],
    [normalizedSearch],
  )

  const selectedTags = searchParams.getAll(TAG_PARAM_KEY)

  const updateTags = useCallback(
    (updater: (prev: string[]) => string[]) => {
      setSearchParams(prev => {
        const currentValues = prev
          .getAll(TAG_PARAM_KEY)
          .flatMap(value => value.split("_").filter(Boolean))
        const next = updater(currentValues)

        prev.delete(TAG_PARAM_KEY)
        next.forEach(tag => {
          prev.append(TAG_PARAM_KEY, tag)
        })
      })
    },
    [setSearchParams],
  )

  const handleQuery = useCallback(
    (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      e.preventDefault()
      const tag = e.currentTarget.dataset.tag!

      updateTags(prevTags => {
        if (prevTags.includes(tag)) {
          return prevTags.filter(t => t !== tag)
        }
        return [...prevTags, tag]
      })
    },
    [updateTags],
  )

  const mounted = useMounted()

  const { newData, tagCounts } = useMemo(() => {
    const fuzzyMatch = (haystack: string, needle: string) => {
      if (!needle) return true
      let matchIndex = 0
      for (
        let i = 0;
        i < haystack.length && matchIndex < needle.length;
        i += 1
      ) {
        if (haystack[i] === needle[matchIndex]) {
          matchIndex += 1
        }
      }
      return matchIndex === needle.length
    }

    const filteredData = mounted
      ? data.filter(item => {
          if (
            selectedTags.length &&
            !selectedTags.every(tag => item.tags.includes(tag))
          ) {
            return false
          }

          if (!searchTokens.length) {
            return true
          }

          const tagNames = item.tags
            .map(tag => allTagsMap.get(tag)?.name ?? tag)
            .join(" ")

          const searchableText = [
            item.frontMatter.name,
            item.frontMatter.description,
            tagNames,
            item.license,
            item.lastRelease,
            item.formattedStars,
            item.frontMatter.github,
            item.frontMatter.npm,
            item.frontMatter.url,
            item.frontMatter.gem,
            item.compiledSource,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()

          if (!searchableText) {
            return false
          }

          return searchTokens.every(token => fuzzyMatch(searchableText, token))
        })
      : data

    const counts = filteredData.reduce<Map<string, number>>((acc, { tags }) => {
      tags.forEach(tag => {
        acc.set(tag, (acc.get(tag) ?? 0) + 1)
      })
      return acc
    }, new Map())

    return {
      newData: filteredData,
      tagCounts: counts,
    }
  }, [mounted, data, selectedTags, allTagsMap, searchTokens])

  const filterTreeItems = useMemo<CheckboxTreeItem[]>(() => {
    const matchesSearch = (label: string) =>
      normalizedSearch ? label.toLowerCase().includes(normalizedSearch) : true

    const getName = (tag: string) => allTagsMap.get(tag)?.name ?? tag
    const getCount = (tag: string) => tagCounts.get(tag) ?? 0

    const nonLanguageTags = new Set([
      "client",
      "server",
      "services",
      "tools",
      "general",
      "gateways-supergraphs",
    ])

    const languages = allTags
      .filter(({ tag }) => !nonLanguageTags.has(tag))
      .map<CheckboxTreeItem>(({ tag }) => ({
        id: `language-${tag}`,
        label: getName(tag),
        value: tag,
        count: getCount(tag),
      }))
      .sort((a, b) => a.label.localeCompare(b.label))

    const baseItems: CheckboxTreeItem[] = [
      {
        id: "category",
        label: "Category",
        children: [
          {
            id: "usage-server",
            label: getName("server"),
            value: "server",
            count: getCount("server"),
          },
          {
            id: "usage-client",
            label: getName("client"),
            value: "client",
            count: getCount("client"),
          },
          {
            id: "category-tools",
            label: getName("tools"),
            value: "tools",
            count: getCount("tools"),
            children: [
              {
                id: "category-tools-gateways-supergraphs",
                label: getName("gateways-supergraphs"),
                value: "gateways-supergraphs",
                count: getCount("gateways-supergraphs"),
              },
              {
                id: "category-tools-general",
                label: getName("general"),
                value: "general",
                count: getCount("general"),
              },
            ],
          },
          {
            id: "category-services",
            label: getName("services"),
            value: "services",
            count: getCount("services"),
          },
        ],
      },
    ]

    if (languages.length > 0) {
      baseItems.push({
        id: "language-support",
        label: "Language Support",
        children: languages,
      })
    }

    const applySearch = (item: CheckboxTreeItem): CheckboxTreeItem => {
      const children = item.children?.map(applySearch) ?? []
      const enabledChildren = children.filter(child => !child.disabled)
      const disabledChildren = children.filter(child => child.disabled)
      const hasEnabledChildren = enabledChildren.length > 0
      const isMatch = matchesSearch(item.label)
      const isDisabled =
        normalizedSearch && !isMatch && !hasEnabledChildren ? true : false

      const orderedChildren =
        children.length > 0
          ? [...enabledChildren, ...disabledChildren]
          : undefined

      return {
        ...item,
        disabled: isDisabled,
        ...(orderedChildren
          ? { children: orderedChildren }
          : { children: undefined }),
      }
    }

    const processed = baseItems.map(applySearch)
    const enabledRoots = processed.filter(item => !item.disabled)
    const disabledRoots = processed.filter(item => item.disabled)

    return [...enabledRoots, ...disabledRoots]
  }, [allTags, allTagsMap, normalizedSearch, tagCounts])

  const handleTreeSelection = useCallback(
    (next: string[]) => {
      updateTags(() => next)
    },
    [updateTags],
  )

  const selectedTagsAsString = useMemo(() => {
    const tags = selectedTags
      .slice()
      .map(tag => allTagsMap.get(tag)?.name ?? tag)
      .filter((tag): tag is string => typeof tag === "string")

    if (tags.length === 0) {
      return ""
    }

    if (tags.length === 1) {
      return tags[0]
    }

    return `${tags.slice(0, -1).join(", ")} and ${tags.slice(-1)[0]}`
  }, [selectedTags, allTagsMap])

  const [sort, setSort] = useState("popularity")
  const [isCollapsing, setIsCollapsing] = useState(false)

  let description = `A collection of tools and libraries for GraphQL`
  let title = "Tools and Libraries | GraphQL"
  if (selectedTagsAsString) {
    description += ` related to ${selectedTagsAsString}`
    title = `${selectedTagsAsString} | ${title}`
  }

  const [showSidebar, setSidebar] = useState(true)

  return (
    <>
      <NextHead>
        <title>{title}</title>
        <meta property="og:title" content={title} key="meta-og-title" />
        <meta name="description" content={description} key="meta-description" />
        <meta
          property="og:description"
          content={description}
          key="meta-og-description"
        />
      </NextHead>
      <div className="gql-container gql-section pb-8">
        <div className="relative mt-8 flex md:gap-8">
          <aside>
            <Collapse horizontal isOpen={showSidebar}>
              <label className="focus-within:gql-focus-outline flex items-center gap-1 border border-neu-300 bg-neu-0 p-2">
                <SearchIcon className="size-5 text-neu-800" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Filter tags..."
                  className="bg-transparent placeholder:text-neu-600 focus:outline-none dark:placeholder:text-neu-400"
                />
              </label>
              <CheckboxTree
                items={filterTreeItems}
                selectedValues={selectedTags}
                onSelectionChange={handleTreeSelection}
              />
            </Collapse>

            <SidebarFooter
              setSidebar={setSidebar}
              showSidebar={showSidebar}
              className="!mx-0 mt-4"
            />
          </aside>

          <div
            className="min-w-0"
            onTransitionEnd={e => {
              if (e.propertyName === "filter") {
                setIsCollapsing(false)
              }
            }}
          >
            <RadioGroup
              value={sort}
              onValueChange={value => setSort(value as string)}
              className="typography-menu flex flex-wrap gap-2 text-sm text-neu-800 dark:text-neu-600 md:flex-nowrap"
            >
              <div>Sort by:</div>
              <label className="-m-1 flex cursor-pointer items-center gap-1 p-1 hover:bg-neu-50/50 [&:has([data-checked])]:text-neu-900">
                <Radio value="popularity" />
                <span>Popularity</span>
              </label>
              <label className="-m-1 flex cursor-pointer items-center gap-1 p-1 hover:bg-neu-50/50 [&:has([data-checked])]:text-neu-900">
                <Radio value="alphabetical" />
                <span>Alphabetical</span>
              </label>
            </RadioGroup>
            <div className="grid gap-2 py-8 md:grid-cols-2 md:gap-4">
              {(sort === "alphabetical"
                ? [...newData].sort((a, b) =>
                    a.frontMatter.name.localeCompare(b.frontMatter.name),
                  )
                : newData
              ).map(
                ({
                  frontMatter,
                  tags,
                  formattedStars,
                  lastRelease,
                  license,
                  compiledSource,
                }) => {
                  const { name, description } = frontMatter
                  const hasMetadata = formattedStars || lastRelease || license
                  return (
                    <Card
                      key={`${name}${tags.toString()}`}
                      className={clsx(
                        "flex h-full flex-col !p-0",
                        "min-w-0", // hack to avoid overflow when opening details
                      )}
                    >
                      <article className="flex grow flex-col gap-7 p-4 lg:p-8">
                        <header className="flex items-center gap-2">
                          <span className="typography-h3 grow break-all">
                            {name}
                          </span>
                          <PackageLinks data={frontMatter} />
                        </header>
                        <div className="flex gap-2">
                          {tags.map(tag => (
                            <NextLink
                              key={tag}
                              href={`/community/tools-and-libraries/?tags=${tag}`}
                              className="flex [&:has(:hover)_.Tag--bg]:opacity-50"
                            >
                              <Tag
                                className="cursor-pointer !capitalize"
                                color="hsl(var(--color-neu-400))" // todo: tags could be color coded like on the conference page
                              >
                                {allTagsMap.get(tag)!.name}
                              </Tag>
                            </NextLink>
                          ))}
                        </div>
                        <Markdown className="line-clamp-4 grow lg:text-lg [&_a]:text-primary">
                          {description}
                        </Markdown>
                        <div className="flex-1" />
                        {hasMetadata && (
                          <div
                            className={clsx(
                              "flex place-items-center gap-2 text-sm [&>*:not(:first-of-type):before]:[content:'/__']",
                            )}
                          >
                            {formattedStars && (
                              <span className="flex items-center gap-1">
                                ★{formattedStars}
                              </span>
                            )}
                            {license && <span>{license}</span>}
                            {lastRelease && (
                              <span>Last released {lastRelease}</span>
                            )}
                          </div>
                        )}
                      </article>

                      {compiledSource && (
                        <details>
                          <summary
                            className={clsx(
                              "flex justify-between px-8 py-5 text-pri-base dark:[[open]>&]:shadow-[-5px_10px_30px_20px_#1b1b1b4d]",
                              "border-t border-neu-100 dark:border-neu-50 [[open]>&]:bg-neu-200 dark:[[open]>&]:bg-neu-50/25",
                              "cursor-pointer",
                            )}
                          >
                            README
                            <CaretDown className="size-5 [[open]>*>&]:rotate-180" />
                          </summary>
                          <div
                            className="px-8 py-5 lg:px-12"
                            suppressHydrationWarning
                          >
                            <RemoteContent compiledSource={compiledSource} />
                          </div>
                        </details>
                      )}
                    </Card>
                  )
                },
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const RemoteContent = memo(function RemoteContent({
  compiledSource,
}: {
  compiledSource: string
}) {
  const { default: MDXContent } = evaluate(compiledSource)
  const components = getComponents({
    isRawLayout: false,
    components: {
      // Rendering README.md with headings messes up the headings hierarchy of the page
      h1: props => <strong {...props} />,
      h2: props => <strong {...props} />,
      h3: props => <strong {...props} />,
      h4: props => <strong {...props} />,
      h5: props => <strong {...props} />,
      h6: props => <strong {...props} />,
    },
  })
  return <MDXContent components={components} />
})

function PackageLinks({ data }: { data: PackageInfo }) {
  const { url, github, npm, gem } = data

  return (
    <>
      {url && (
        <Button href={url} variant="tertiary" isIconButton>
          <GlobeIcon className="size-5" />
        </Button>
      )}
      {github && (
        <Button
          href={`https://github.com/${github}`}
          variant="tertiary"
          isIconButton
        >
          <GitHubIcon className="size-5" />
        </Button>
      )}
      {npm && (
        <Button
          href={`https://npmjs.com/package/${npm}`}
          variant="tertiary"
          isIconButton
        >
          <NPMIcon className="size-5" viewBox="0 0 30 30" />
        </Button>
      )}
      {gem && (
        <Button
          href={`https://rubygems.org/gems/${gem}`}
          variant="tertiary"
          isIconButton
        >
          <RubyGemsIcon className="size-5" />
        </Button>
      )}
    </>
  )
}
