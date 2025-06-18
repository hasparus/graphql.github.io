import { StripesDecoration } from "@/app/conf/_design-system/stripes-decoration"

import GraphQLFoundationWordmark from "../../assets/graphql-foundation-wordmark.svg?svgr"
import logoMask from "../cta-card-section/logo-mask.webp"
import { HeroDateAndLocation } from "."

export function HeroConfCard() {
  return (
    <div className="relative w-[590px] overflow-hidden border border-white bg-white/[0.24] p-8 backdrop-blur-xl">
      <div
        role="presentation"
        className="pointer-events-none absolute inset-0 -right-8 -top-16 [--end:rgba(255,204,239,0.2)] [--start:#FF99DF]"
        style={{
          maskImage: `url(${logoMask.src})`,
          maskRepeat: "no-repeat",
          maskPosition: "33px -22px",
          maskSize: "743px",
        }}
      >
        <StripesDecoration
          stripeWidth="8px"
          oddClassName="bg-[linear-gradient(180deg,var(--start)_0%,var(--end)_100%)]"
        />
      </div>

      <div className="relative z-10 space-y-8">
        <h2 className="text-[48px] font-normal leading-[1.2] text-neu-900">
          GraphQLConf
          <br />
          2025
        </h2>

        <div className="flex h-min items-center gap-4">
          <span className="typography-body-sm whitespace-pre">hosted by</span>
          <GraphQLFoundationWordmark
            width={128}
            height={34.877}
            className="[&_path]:fill-pri-base"
          />
        </div>

        <HeroDateAndLocation className="[&_svg]:text-pri-base" />
      </div>
    </div>
  )
}
