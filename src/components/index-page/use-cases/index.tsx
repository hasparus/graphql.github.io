"use client"

import clsx from "clsx"
import { useState } from "react"

import { Button } from "@/app/conf/_design-system/button"
import ArrowRightIcon from "./arrow-right.svg?svgr"
import { StripesDecoration } from "@/app/conf/_design-system/stripes-decoration"

import blurBean from "./blur-bean.webp"

type UseCase = {
  label: string
  description: string
  cta: string
  href: string
}

const USE_CASES: UseCase[] = [
  {
    label: "A large backend with many services",
    description:
      "GraphQL serves as a unified data layer across multiple services. This way you simplify API management and reduce dependencies between teams. It enables efficient data fetching while keeping the API surface flexible and maintainable.",
    cta: "Best Practices for Large-Scale Systems",
    href: "/learn/best-practices",
  },
  {
    label: "A mobile app",
    description:
      "Fetch only the data you need to minimize payload size and round-trips. Build resilient UIs that work well on variable networks.",
    cta: "Mobile Patterns",
    href: "/learn/best-practices#mobile",
  },
  {
    label: "A frontend-heavy app with advanced UI needs",
    description:
      "Co-locate queries with components and keep state consistent. Compose data from many backends without bespoke endpoints.",
    cta: "Frontend Integration Guide",
    href: "/learn/queries#components",
  },
  {
    label: "An app with real-time updates",
    description:
      "Use subscriptions for low-latency updates while keeping the schema as the single contract for clients and servers.",
    cta: "Real-time with Subscriptions",
    href: "/learn/subscriptions",
  },
  {
    label: "A simple full stack TypeScript app",
    description:
      "Strong types end-to-end with code generation and great DX. Ship faster without compromising correctness.",
    cta: "Full Stack TS Starter",
    href: "/learn#typescript",
  },
]

export function UseCases({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selected = USE_CASES[selectedIndex]

  return (
    <section
      className={clsx("gql-container dark:text-neu-0", className)}
      {...props}
    >
      <div className="mx-auto flex max-w-[1440px] *:basis-1/2 max-lg:flex-col 3xl:min-h-[800px]">
        <div className="relative flex flex-col bg-sec-light p-4 dark:bg-neu-50 dark:text-neu-900 lg:p-8 xl:p-16">
          <h2 className="typography-h2">Is GraphQL right for&nbsp;me?</h2>
          <p className="typography-body-lg mt-6 text-balance text-neu-800">
            Choose a use case most relevant for your project and learn how
            GraphQL can help you build faster, modern solutions.
          </p>

          <div className="3xl:flex-1" />
          <ul className="mt-8 divide-y divide-sec-dark border border-sec-dark lg:mt-16">
            {USE_CASES.map((useCase, i) => (
              <li key={useCase.label}>
                <button
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  aria-selected={i === selectedIndex ? "true" : undefined}
                  className="group flex w-full items-center justify-between gap-6 px-3 py-4 text-left transition-colors hover:bg-sec-lighter aria-selected:bg-sec-base aria-selected:hover:bg-sec-lighter hover:dark:bg-neu-100/25 dark:aria-selected:bg-sec-darker"
                >
                  <span className="typography-body-lg">{useCase.label}</span>
                  <ArrowRightIcon className="size-10 shrink-0 text-sec-dark opacity-0 transition-opacity group-hover:opacity-100 group-aria-selected:opacity-100 dark:text-neu-900" />
                </button>
              </li>
            ))}
          </ul>
          <div className="3xl:flex-1" />
        </div>

        <article className="relative flex h-auto flex-col bg-sec-base p-8 dark:bg-sec-darker md:p-12 lg:p-16">
          <Stripes />
          <div className="z-10 my-auto max-h-[528px] max-w-2xl">
            <h3 className="typography-body-lg text-sec-darker dark:text-sec-lighter">
              {selected.label}
            </h3>
            <p className="typography-h3 mt-10 text-neu-800">
              {selected.description}
            </p>
            <div className="mt-8 flex xl:mt-[120px]">
              <Button href={selected.href} variant="primary">
                {selected.cta}
                <ArrowRightIcon className="size-6 shrink-0 text-neu-0" />
              </Button>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

function Stripes() {
  const mask = `url(${blurBean.src})`
  return (
    <div
      role="presentation"
      className="pointer-events-none absolute inset-0"
      style={{
        maskImage: mask,
        WebkitMaskImage: mask,
        maskPosition: "bottom 150% right 50%",
        WebkitMaskPosition: "bottom 150% right 50%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    >
      <StripesDecoration
        evenClassName="bg-[linear-gradient(0deg,_hsl(var(--color-sec-dark))_0%,_hsl(var(--color-sec-base))_100%)] dark:bg-[linear-gradient(0deg,_hsl(var(--color-sec-dark))_0%,_hsl(var(--color-sec-darker))_100%)]"
        oddClassName="bg-[linear-gradient(0deg,_hsl(var(--color-sec-lighter))_0%,_hsl(79_81%_40%/0)_100%)] dark:bg-[linear-gradient(0deg,_hsl(var(--color-neu-dark))_0%,_rgba(133,185,19,0.00)_100%)]"
      />
    </div>
  )
}
