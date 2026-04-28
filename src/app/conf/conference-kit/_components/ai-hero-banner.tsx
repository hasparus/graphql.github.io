import { StripesDecoration } from "@/app/conf/_design-system/stripes-decoration"
import GraphQLFoundationWordmark from "@/app/conf/2026/assets/graphql-foundation-wordmark.svg?svgr"
import CheckIcon from "@/app/conf/_design-system/pixelarticons/check.svg?svgr"
import logoMask from "@/app/conf/2026/components/cta-card-section/logo-mask.webp"

import { BannerFrame } from "./banner-frame"
import { TrustedLogosGrid } from "./trusted-logos"
import { GraphQLWordmarkLogo } from "@/icons"

const bullets = [
  "Typed schemas LLMs can reason about",
  "Frictionless distributed development",
  "One contract for UIs and autonomous agents",
]

export function AiHeroBanner() {
  return (
    <BannerFrame
      caption="AI-native hero — generic"
      className="text-white"
      style={{
        background: "linear-gradient(180deg, #F2009A 0%, #500437 100%)",
      }}
    >
      <div className="mx-12 flex h-24 items-center">
        <GraphQLWordmarkLogo className="h-10 !fill-white" />
      </div>

      <div className="mx-12 mt-8 flex flex-col gap-9">
        <h2
          className="m-0 text-[64px] font-medium text-white"
          style={{
            lineHeight: 1.03,
            letterSpacing: "-0.025em",
            textWrap: "balance",
          }}
        >
          The API language for humans and agents
        </h2>

        <ul className="m-0 flex list-none flex-col gap-[18px] p-0">
          {bullets.map(text => (
            <li key={text} className="flex items-start gap-3">
              <span className="pt-1">
                <CheckIcon className="-mt-0.5 block size-8 shrink-0 text-white" />
              </span>
              <span
                className="text-[28px] text-white/95"
                style={{
                  lineHeight: 1.3,
                  textWrap: "pretty",
                  letterSpacing: "-0.01em",
                }}
              >
                {text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Decoration: blurred-logo mask + vertical stripes behind the logo wall */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden"
        style={{ height: 640 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.22), rgba(255,255,255,0.02))",
            maskImage: `url(${logoMask.src})`,
            WebkitMaskImage: `url(${logoMask.src})`,
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskSize: "95%",
            WebkitMaskSize: "95%",
            maskPosition: "center 55%",
            WebkitMaskPosition: "center 55%",
          }}
        />
        <StripesDecoration
          stripeWidth="5px"
          angle="90deg"
          oddClassName="bg-[linear-gradient(to_bottom,rgba(255,255,255,0.18),rgba(255,255,255,0))]"
        />
      </div>

      <div className="absolute inset-x-12 bottom-12 flex flex-col gap-4">
        <span
          className="font-mono text-xs uppercase text-white/85"
          style={{ letterSpacing: "0.14em" }}
        >
          Trusted by the industry
        </span>
        <TrustedLogosGrid cellHeight={56} className="gap-y-5" />
      </div>
    </BannerFrame>
  )
}
