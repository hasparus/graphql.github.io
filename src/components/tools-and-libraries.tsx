import {
  GitHubIcon,
  GlobeIcon,
  NPMIcon,
  StarIcon,
  MagnifyingGlassIcon,
  RubyGemsIcon,
  ChevronLeftIcon,
} from "@/icons"
import { Card } from "@/components"
import NextLink from "next/link"
import NextHead from "next/head"
import { useMounted } from "nextra/hooks"
import Markdown from "markdown-to-jsx"
import { evaluate } from "nextra/components"

import {
  DelimitedArrayParam,
  useQueryParam,
  withDefault,
} from "use-query-params"
import {
  useCallback,
  useState,
  MouseEvent,
  useMemo,
  KeyboardEventHandler,
  memo,
} from "react"
import { clsx } from "clsx"
import { getComponents } from "nextra-theme-docs"
import { RadioGroup, RadioGroupItem } from "@/components/radio"
import { Button } from "@/app/conf/_design-system/button"
import { Tag } from "@/app/conf/_design-system/tag"

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

const TagParam = withDefault(DelimitedArrayParam, [])

export function CodePage({ allTags, data }: CodePageProps) {
  const allTagsMap = useMemo(
    () =>
      new Map(allTags.map(({ tag, count, name }) => [tag, { count, name }])),
    [],
  )

  const [search, setSearch] = useState("")
  const [queryParamsTags, setTags] = useQueryParam("tags", TagParam)

  const handleQuery = useCallback(
    (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      e.preventDefault()
      const tag = e.currentTarget.dataset.tag!

      setTags(prevTags => {
        if (prevTags!.includes(tag)) {
          return prevTags!.filter(t => t !== tag)
        }
        return [...prevTags!, tag]
      })
    },
    [setTags],
  )

  const mounted = useMounted()
  const [isBackspacePressed, setIsBackspacePressed] = useState(false)

  const inputTags =
    mounted &&
    queryParamsTags
      .map(tag => [tag, allTagsMap.get(tag as string)?.name])
      .filter(([, name]) => name)
      .map(([tag, name]) => (
        <button
          key={tag}
          className="shrink-0 pr-2"
          data-tag={tag}
          title={`Remove tag "${name}"`}
          onClick={handleQuery}
        >
          {name} <span className="text-primary">+</span>
        </button>
      ))

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    e => {
      if (e.key === "Backspace" && !search) {
        if (isBackspacePressed) {
          setIsBackspacePressed(false)
          setTags(prevTags => prevTags!.slice(0, -1))
        } else {
          setIsBackspacePressed(true)
        }
      }
    },
    [isBackspacePressed, search],
  )

  const { newData, queryTags } = useMemo(() => {
    const newData = mounted
      ? data.filter(({ tags }) => {
          const matchQueryParamsTags =
            !queryParamsTags.length ||
            (queryParamsTags as string[]).every(tag => tags.includes(tag))

          return matchQueryParamsTags
        })
      : data

    const queryTags = newData
      .flatMap(({ tags }) => tags)
      .reduce<Record<string, number>>((acc, tag) => {
        acc[tag] ??= 0
        acc[tag] += 1
        return acc
      }, {})

    return {
      newData,
      queryTags: Object.entries(queryTags)
        .filter(
          ([tag]) => !mounted || !(queryParamsTags as string[]).includes(tag),
        )
        .map(([tag, count]) => ({
          tag,
          count,
          name: allTagsMap.get(tag)?.name || "",
        })),
    }
  }, [mounted, data, queryParamsTags])

  const selectedTagsAsString = useMemo(() => {
    const tags = queryParamsTags
      .slice()
      .map(tag => allTagsMap.get(tag as string)?.name ?? tag)
      .filter((tag): tag is string => typeof tag === "string")

    if (tags.length === 0) {
      return ""
    }

    if (tags.length === 1) {
      return tags[0]
    }

    return `${tags.slice(0, -1).join(", ")} and ${tags.slice(-1)[0]}`
  }, [queryParamsTags, allTagsMap])

  const [sort, setSort] = useState("popularity")

  let description = `A collection of tools and libraries for GraphQL`
  let title = "Tools and Libraries | GraphQL"
  if (selectedTagsAsString) {
    description += ` related to ${selectedTagsAsString}`
    title = `${selectedTagsAsString} | ${title}`
  }

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
      <div className="container py-8 md:pt-16">
        <h1 className="typography-h1">Code Using GraphQL</h1>
        <div className="typography-h3 my-10 flex max-w-[700px] items-center border-b border-current pb-2.5">
          <div
            className={clsx(
              "flex shrink-0",
              isBackspacePressed && "last:*:opacity-50",
            )}
          >
            {inputTags}
          </div>
          <input
            // TODO: This should also do a fuzzy full text search, not just search on tags.
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className={clsx(
              "block grow bg-transparent",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "focus-visible:border-b-primary",
            )}
          />
          <MagnifyingGlassIcon className="shrink-0" />
        </div>
        <div className="flex flex-wrap gap-2">
          {queryTags.map(({ tag, count, name }) => {
            const isTagMatchSearch =
              !search || name.toLowerCase().includes(search.toLowerCase())
            if (!isTagMatchSearch) return

            return (
              <NextLink
                href={`/community/tools-and-libraries/?tags=${tag}`}
                key={tag}
                data-tag={tag}
                onClick={handleQuery}
                title={`${mounted && (queryParamsTags as string[]).includes(tag) ? "Remove" : "Add"} tag "${name}"`}
                className="flex"
              >
                <Tag
                  className="!capitalize lg:!text-sm [&:has(:hover)_.Tag--bg]:opacity-50"
                  color="hsl(var(--color-neu-500)/.8)"
                >
                  {name} ({count})
                </Tag>
              </NextLink>
            )
          })}
        </div>
      </div>
      <RadioGroup
        value={sort}
        onValueChange={setSort}
        className="container flex gap-2"
      >
        <div className="mr-4">Sort by:</div>
        <div className="flex items-center">
          <RadioGroupItem value="popularity" id="r1" />
          <label htmlFor="r1" className="cursor-pointer pl-2">
            Popularity
          </label>
        </div>
        <div className="flex items-center">
          <RadioGroupItem value="alphabetical" id="r2" />
          <label htmlFor="r2" className="cursor-pointer pl-2">
            Alphabetical
          </label>
        </div>
      </RadioGroup>

      {/* todo: add md:*:h-full when the readme opens in a modal */}
      <div className="container grid gap-2 py-8 md:grid-cols-2 md:gap-4">
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
                  "flex h-max flex-col !p-0",
                  "min-w-0", // hack to avoid overflow when opening details
                )}
              >
                <div className="flex grow flex-col gap-7 p-4 lg:p-8">
                  <div className="flex items-center gap-2">
                    <span className="typography-h3 grow break-all">{name}</span>
                    <PackageLinks data={frontMatter} />
                  </div>
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
                        "flex items-center gap-5 max-md:text-xs",
                        "[&>:not(:last-child)]:border-r [&>:not(:last-child)]:border-neu-500 [&>:not(:last-child)]:pr-5",
                      )}
                    >
                      {lastRelease && <span>Last release {lastRelease}</span>}
                      {formattedStars && (
                        <span className="flex items-center gap-1">
                          <StarIcon className="text-primary" />
                          {formattedStars}
                        </span>
                      )}
                      {license && <span>{license}</span>}
                    </div>
                  )}
                </div>

                {compiledSource && (
                  <details className="bg-neu-100">
                    <summary
                      className={clsx(
                        "flex justify-between px-8 py-5 text-primary lg:px-12 dark:[[open]>&]:shadow-[-5px_10px_30px_20px_#1b1b1b4d]",
                        "[[open]>&]:bg-neu-200",
                        "cursor-pointer",
                      )}
                    >
                      README
                      <ChevronLeftIcon className="size-5 -rotate-90 transition-transform [[open]>*>&]:rotate-90" />
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
