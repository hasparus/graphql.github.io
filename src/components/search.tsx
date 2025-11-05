/* eslint-disable tailwindcss/no-custom-classname */
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react"
import { clsx } from "clsx"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useMounted } from "nextra/hooks"
import { InformationCircleIcon, SpinnerIcon } from "nextra/icons"
import type {
  FocusEventHandler,
  ReactElement,
  ReactNode,
  SyntheticEvent,
} from "react"
import { Fragment, useCallback, useEffect, useRef, useState } from "react"

export type SearchResult = {
  children: ReactNode
  id: string
  prefix?: ReactNode
  route: string
}

type SearchProps = {
  className?: string
  value: string
  onChange: (newValue: string) => void
  onActive?: () => void
  loading?: boolean
  error?: boolean
  results: SearchResult[]
  setMenu: (state: false) => void
}

const INPUTS = new Set(["input", "select", "button", "textarea"])

export function Search({
  className,
  value,
  onChange,
  onActive,
  loading,
  error,
  results,
  setMenu,
}: SearchProps): ReactElement {
  const router = useRouter()
  const [focused, setFocused] = useState(false)
  const mounted = useMounted()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function down(event: globalThis.KeyboardEvent) {
      const input = inputRef.current
      const activeElement = document.activeElement as HTMLElement
      const tagName = activeElement?.tagName.toLowerCase()
      if (
        !input ||
        !tagName ||
        INPUTS.has(tagName) ||
        activeElement?.isContentEditable
      )
        return
      if (
        event.key === "/" ||
        (event.key === "k" &&
          (event.metaKey /* for Mac */ || /* for non-Mac */ event.ctrlKey))
      ) {
        event.preventDefault()
        // prevent to scroll to top
        input.focus({ preventScroll: true })
      }
    }

    window.addEventListener("keydown", down)
    return () => {
      window.removeEventListener("keydown", down)
    }
  }, [])

  const icon = mounted && !focused && (
    <kbd
      className={clsx(
        "_absolute _my-1.5 _select-none ltr:_right-1.5 rtl:_left-1.5",
        "_h-5 _rounded _bg-white _px-1.5 _font-mono _text-[11px] _font-medium _text-gray-500",
        "_border dark:_border-gray-100/20 dark:_bg-black/50",
        "contrast-more:_border-current contrast-more:_text-current contrast-more:dark:_border-current",
        "_items-center _gap-1 _flex",
        "max-sm:_hidden",
      )}
    >
      {navigator.userAgent.includes("Mac") ? (
        <>
          <span className="_text-xs">⌘</span>K
        </>
      ) : (
        "CTRL K"
      )}
    </kbd>
  )

  const handleFocus = useCallback<FocusEventHandler>(
    event => {
      const isFocus = event.type === "focus"
      if (isFocus) onActive?.()
      setFocused(isFocus)
    },
    [onActive],
  )

  const handleChange = useCallback(
    (event: SyntheticEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget
      onChange(value)
    },
    [onChange],
  )

  const handleSelect = useCallback(
    async (searchResult: SearchResult | null) => {
      if (!searchResult) return
      // Calling before navigation so selector `html:not(:has(*:focus))` in styles.css will work,
      // and we'll have padding top since input is not focused
      inputRef.current?.blur()
      await router.push(searchResult.route)
      // Clear input after navigation completes
      setMenu(false)
      onChange("")
    },
    [router, setMenu, onChange],
  )

  return (
    <Combobox onChange={handleSelect}>
      <div
        className={clsx(
          "not-prose", // for blog
          "relative flex items-center",
          "text-gray-900 dark:text-gray-300",
          "contrast-more:text-gray-800 contrast-more:dark:text-gray-300",
          className,
        )}
      >
        <ComboboxInput
          ref={inputRef}
          spellCheck={false}
          className={({ focus }) =>
            clsx(
              "rounded-lg px-3 py-2 transition-colors",
              "w-full md:w-64",
              "text-base leading-tight md:text-sm",
              focus
                ? "nextra-focusable bg-transparent"
                : "bg-black/[.05] dark:bg-gray-50/10",
              "placeholder:text-gray-500 dark:placeholder:text-gray-400",
              "contrast-more:border contrast-more:border-current",
              "[&::-webkit-search-cancel-button]:_appearance-none",
            )
          }
          autoComplete="off"
          type="search"
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleFocus}
          value={value}
          placeholder="Search..."
        />
        {icon}
      </div>
      <ComboboxOptions
        transition
        anchor={{ to: "top end", gap: 10, padding: 16 }}
        className={({ open }) =>
          clsx(
            "nextra-scrollbar max-md:h-full",
            "border border-gray-200 text-gray-100 dark:border-neutral-800",
            "z-20 rounded-xl py-2.5 shadow-xl",
            "contrast-more:border contrast-more:border-gray-900 contrast-more:dark:border-gray-50",
            "bg-[rgb(var(--nextra-bg),.8)] backdrop-blur-lg",
            "transition-opacity motion-reduce:transition-none",
            open ? "opacity-100" : "opacity-0",
            error || loading || !results.length
              ? "md:h-[100px]"
              : // headlessui adds max-height as style, use !important to override
                "md:!max-h-[min(calc(100vh-5rem),400px)]",
            "w-full md:w-[576px]",
            "empty:invisible",
          )
        }
      >
        {error ? (
          <span className="_flex _select-none _justify-center _gap-2 _p-8 _text-center _text-sm _text-red-500">
            <InformationCircleIcon className="_size-5" />
            Failed to load search index.
          </span>
        ) : loading ? (
          <span className="_flex _select-none _justify-center _gap-2 _p-8 _text-center _text-sm _text-gray-400">
            <SpinnerIcon className="_size-5 _animate-spin" />
            Loading…
          </span>
        ) : results.length ? (
          results.map(searchResult => (
            <Fragment key={searchResult.id}>
              {searchResult.prefix}
              <ComboboxOption
                as={NextLink}
                value={searchResult}
                href={searchResult.route}
                className={({ focus }) =>
                  clsx(
                    "_mx-2.5 _break-words _rounded-md",
                    "contrast-more:_border",
                    focus
                      ? "_text-primary-600 contrast-more:_border-current _bg-primary-500/10"
                      : "_text-gray-800 dark:_text-gray-300 contrast-more:_border-transparent",
                    "_block _scroll-m-12 _px-2.5 _py-2",
                  )
                }
              >
                {searchResult.children}
              </ComboboxOption>
            </Fragment>
          ))
        ) : (
          value && (
            <span className="block select-none p-8 text-center text-sm text-neu-700">
              No results found.
            </span>
          )
        )}
      </ComboboxOptions>
    </Combobox>
  )
}
