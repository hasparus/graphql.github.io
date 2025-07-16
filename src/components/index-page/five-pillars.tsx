import { SectionLabel } from "@/app/conf/_design-system/section-label"

import CheckIcon from "@/icons/check.svg?svgr"
import GlobeIcon from "@/icons/globe.svg?svgr"
import CodeIcon from "@/icons/code.svg?svgr"
import StarIcon from "@/icons/star.svg?svgr"
import MagnifyingGlassIcon from "@/icons/magnifying-glass.svg?svgr"

const pillars = [
  {
    icon: CheckIcon,
    title: "Product-centric",
    description:
      "GraphQL is unapologetically built for front-end engineers, aligning with their way of thinking, how views are structured and how data is consumed.",
  },
  {
    icon: GlobeIcon,
    title: "Hierarchical",
    description:
      "Most product development involves the creation and manipulation of view hierarchies. GraphQL queries mirror UI structures, ensuring a natural way to request data that matches the shape of the response.",
  },
  {
    icon: CodeIcon,
    title: "Strong-typing",
    description:
      "Every GraphQL service defines a type system, enabling tools to syntactically validate queries before execution and ensuring predictable responses.",
  },
  {
    icon: StarIcon,
    title: "Client-specified response",
    description:
      "A GraphQL service publishes the capabilities that its clients are allowed to consume. It is the client who control the data they receive, requesting only what they need at a field level, unlike traditional fixed endpoints.",
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Self-documenting",
    description:
      "GraphQL APIs can describe themselves, allowing tools and clients to query the schema for available types and capabilities. It serves as a powerful platform for building common tools and client software libraries.",
  },
]

export function FivePillars() {
  return (
    <section className="gql-container gql-section xl:py-20">
      <SectionLabel className="mb-6">design principles</SectionLabel>
      <h2 className="typography-h2 mb-6 max-lg:text-center lg:mb-16">
        Five Pillars of GraphQL
      </h2>

      <div className="gql-radial-gradient gap-px">
        {pillars.map(({ title, icon: Icon, description }, index) => (
          <div key={title}>
            <div className="flex flex-col items-center gap-2 bg-neu-0 py-6 max-lg:text-center lg:flex-row lg:items-center lg:gap-8 lg:py-8">
              <div className="flex items-center max-lg:flex-col lg:w-[520px] lg:shrink-0">
                <div className="p-6">
                  <Icon className="size-6 text-pri-base" />
                </div>
                <h3 className="typography-h3 lg:flex lg:h-[86px] lg:flex-1 lg:items-center lg:p-4">
                  {title}
                </h3>
              </div>
              <p className="typography-body-lg mt-6 lg:mt-0 lg:flex-1">
                {description}
              </p>
            </div>
            {index < pillars.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </section>
  )
}

function Separator() {
  return (
    <div
      className="h-px w-full"
      style={{
        background: `linear-gradient(90deg, hsl(var(--color-neu-100) / 0) 0%, hsl(var(--color-neu-300) / 0.75) 25%, hsl(var(--color-neu-400)) 50%, hsl(var(--color-neu-300) / 0.75) 75%, hsl(var(--color-neu-100) / 0) 100%)`,
      }}
    />
  )
}
