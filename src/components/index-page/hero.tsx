import Link from "next/link"
import { GraphQLLogo } from "@/icons"
import { StripesDecoration } from "@/app/conf/_design-system/stripes-decoration"
import CheckIcon from "@/app/conf/_design-system/pixelarticons/check.svg?svgr"
import { Button } from "@/app/conf/_design-system/button"

export function Hero() {
  return (
    <div className="relative min-h-screen bg-neu-0">
      <HeroStripes />

      <div className="flex max-w-4xl flex-col gap-10 py-24 pl-24 pr-10">
        <h1 className="typography-h1 max-w-3xl text-neu-900">
          The query language for modern APIs
        </h1>

        <ul className="flex flex-col gap-2">
          {[
            "Deliver high-performance user experience at scale",
            "Secure and stabilize your API with a strongly typed schema and validated queries",
            "Reduce dependencies through efficient, distributed development",
          ].map((item, index) => (
            <li key={index} className="flex items-center gap-1">
              <CheckIcon className="size-6 shrink-0 text-pri-base" />
              <p className="typography-body-sm text-neu-800">{item}</p>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <Button href="/learn">Get Started</Button>
        </div>
      </div>
    </div>
  )
}

function HeroStripes() {
  return (
    <div className="pointer-events-none absolute right-0 top-0 h-full overflow-hidden">
      <StripesDecoration
        stripeWidth="5px"
        oddClassName="bg-gradient-to-b from-sec-base to-pri-lighter"
      />
    </div>
  )
}
