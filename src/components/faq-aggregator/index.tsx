"use client"

import { getMdxHeadings } from "@/_design-system/mdx-components/get-mdx-headings"
import { type ReactNode, useRef, useLayoutEffect, useState } from "react"

function slugify(text: string): string {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

const mdxHeadings = getMdxHeadings()

function FaqH1({ id, children }: { id?: string; children?: ReactNode }) {
  const slug = id ?? slugify(String(children))
  return (
    <mdxHeadings.h2
      id={slug}
      size="h1"
      className="mb-4 mt-8 scroll-mt-24 text-neu-900 first:mt-0"
    >
      {children}
    </mdxHeadings.h2>
  )
}

function FaqH2({ id, children }: { id?: string; children?: ReactNode }) {
  const slug = id ?? slugify(String(children))
  return (
    <details className="group border-b border-neu-100 dark:border-neu-200 [&:first-of-type]:border-t [&>p:first-of-type]:!mt-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
        <h3 id={slug} className="typography-body-lg text-neu-900">
          {children}
        </h3>
        <ChevronIcon className="size-5 shrink-0 text-neu-600 transition-transform group-open:rotate-180" />
      </summary>
    </details>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function FaqAggregator({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [, forceUpdate] = useState(0)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const details = container.querySelectorAll("details")
    details.forEach(detail => {
      const answerContent: Node[] = []
      let sibling = detail.nextSibling

      while (sibling) {
        const next = sibling.nextSibling
        if (sibling instanceof Element) {
          if (sibling.tagName === "DETAILS" || sibling.tagName === "H2") break
          answerContent.push(sibling)
        } else if (
          sibling.nodeType === Node.TEXT_NODE &&
          sibling.textContent?.trim()
        ) {
          answerContent.push(sibling)
        }
        sibling = next
      }

      if (answerContent.length > 0) {
        answerContent.forEach(node => detail.appendChild(node))
      }
    })

    forceUpdate(n => n + 1)
  }, [])

  return <div ref={containerRef}>{children}</div>
}

export const faqMdxComponents = {
  h1: FaqH1,
  h2: FaqH2,
}
