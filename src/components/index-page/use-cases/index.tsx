"use client"

import clsx from "clsx"
import { useState } from "react"

import { Button } from "@/app/conf/_design-system/button"
import ArrowRightIcon from "./arrow-right.svg?svgr"

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
        <div className="relative flex flex-col border-sec-dark bg-sec-light p-4 lg:border-r lg:p-8 xl:p-16">
          <h2 className="typography-h2">Is GraphQL right for&nbsp;me?</h2>
          <p className="typography-body-lg mt-6 text-neu-800">
            Choose a use case most relevant for your project and learn how
            GraphQL can help you build faster, modern solutions.
          </p>

          <div className="3xl:flex-1" />
          <ul className="mt-8 divide-y divide-sec-dark border border-sec-dark">
            {USE_CASES.map((useCase, i) => (
              <li key={useCase.label}>
                <button
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  aria-selected={i === selectedIndex ? "true" : undefined}
                  className="flex w-full items-center justify-between gap-6 px-3 py-4 text-left transition-colors hover:bg-sec-lighter aria-selected:bg-sec-base aria-selected:hover:bg-sec-lighter"
                >
                  <span className="typography-body-lg">{useCase.label}</span>
                  <ArrowRightIcon className="size-10 shrink-0 text-sec-dark opacity-0 group-aria-selected:opacity-100" />
                </button>
              </li>
            ))}
          </ul>
          <div className="3xl:flex-1" />
        </div>

        <article className="relative flex h-auto flex-col bg-sec-base p-8 md:p-12 lg:p-16">
          <Stripes />
          <div className="z-10 my-auto max-h-[528px] max-w-2xl">
            <h3 className="typography-body-lg text-sec-darker">
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

const maskEven =
  "repeating-linear-gradient(to right, transparent, transparent 12px, black 12px, black 24px)"
const maskOdd =
  "repeating-linear-gradient(to right, black, black 12px, transparent 12px, transparent 24px)"

function Stripes() {
  const mask = "linear-gradient(125deg, transparent 68%, hsl(0 0 0 / 0.8))"
  return (
    <div
      role="presentation"
      className="pointer-events-none absolute inset-0 bottom-[-20px] -z-10 translate-x-0.5 translate-y-12 ease-linear max-lg:hidden"
      style={{
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          maskImage: maskOdd,
          WebkitMaskImage: maskOdd,
          maskPosition: "right",
          backgroundImage:
            "linear-gradient(0deg, hsl(var(--color-sec-lighter)) 0%, rgba(133, 185, 19, 0.00) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          maskImage: maskEven,
          WebkitMaskImage: maskEven,
          maskPosition: "right",
          backgroundImage:
            "linear-gradient(0deg, hsl(var(--color-sec-dark)) 0%, hsl(var(--color-sec-base)) 100%)",
        }}
      />
    </div>
  )
}
