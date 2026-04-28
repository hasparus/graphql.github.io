import { GraphQLWordmarkLogo } from "@/icons"
import { MobileDiagram } from "@/components/index-page/what-is-graphql/wires"
import wiresStyles from "@/components/index-page/what-is-graphql/wires.module.css"

import { BannerFrame } from "./banner-frame"
import { BlobStripes } from "./blob-stripes"
import { CityQuerySnippet } from "./city-query-snippet"
import { QRPlaceholder } from "./qr-placeholder"
import { TRUSTED_LOGOS } from "./trusted-logos"

export function LanguageBanner() {
  return (
    <BannerFrame
      slug="language"
      caption="GraphQL — the query language"
      className="flex flex-col gap-7 bg-[#0A0B08] p-9 text-white"
    >
      <BlobStripes
        position="70% 30%"
        size="155%"
        stripeWidth="14px"
        evenClassName="bg-[linear-gradient(180deg,rgba(132,205,22,0.18)_0%,rgba(132,205,22,0.03)_100%)]"
        oddClassName="bg-[linear-gradient(180deg,rgba(132,205,22,0.04)_0%,rgba(70,109,11,0.18)_100%)]"
      />

      <div className="z-10 flex items-center justify-between">
        <GraphQLWordmarkLogo className="h-8 !fill-white" />
        <div
          className="flex flex-wrap items-center gap-2.5 font-mono text-[13px] text-sec-base"
          style={{ letterSpacing: "0.02em" }}
        >
          <span>schema-first</span>
          <span className="text-sec-light">•</span>
          <span>typesafe</span>
          <span className="text-sec-light">•</span>
          <span>flexible</span>
          <span className="text-sec-light">•</span>
          <span>fast</span>
        </div>
      </div>

      <h2 className="z-10 mb-0 mt-16 text-[60px] font-medium leading-[1.05] tracking-tight">
        The query
        <br />
        language
        <br />
        for your API
      </h2>

      <p
        className="typography-body-lg z-10 m-0 text-white/80"
        style={{ lineHeight: 1.4, textWrap: "pretty" }}
      >
        An open-standard query language and runtime that lets clients ask for
        exactly the data they need — and nothing more.
      </p>

      <div className="relative isolate z-10 flex flex-1 items-center justify-center">
        <MobileDiagram step={1} className="block overflow-visible" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className={`${wiresStyles.highlightsQuery} border border-sec-base/25 bg-[#0A0B08]/80 py-3 backdrop-blur-sm`}
            style={{ ["--highlight-opacity" as string]: 1 }}
          >
            <CityQuerySnippet />
          </div>
        </div>
      </div>

      <div className="z-10 mt-auto grid grid-cols-2 gap-2.5">
        <div className="flex h-24 items-center gap-3.5 border border-white/10 bg-white/[0.02] p-3.5">
          <div className="flex size-16 shrink-0 items-center justify-center border-[1.5px] border-sec-base">
            <ArrowRightLine className="size-7 text-sec-base" />
          </div>
          <div className="min-w-0">
            <div
              className="text-[15px] font-medium"
              style={{ letterSpacing: "-0.01em" }}
            >
              Read the spec
            </div>
            <div
              className="mt-1 text-[12px] text-white/70"
              style={{ lineHeight: 1.3 }}
            >
              Open standard,
              <br />
              vendor-neutral.
            </div>
          </div>
        </div>

        <div className="flex h-24 items-center gap-3.5 border border-white/10 bg-white/[0.02] p-3.5">
          <div className="flex size-[68px] shrink-0 items-center justify-center border-[1.5px] border-sec-base p-1">
            <QRPlaceholder size={56} color="#FAFCF4" />
          </div>
          <div className="min-w-0">
            <div
              className="font-mono text-[11px] lowercase text-sec-base"
              style={{ letterSpacing: "0.06em" }}
            >
              Learn more
            </div>
            <div
              className="mt-1 text-[18px] font-medium"
              style={{ letterSpacing: "-0.01em" }}
            >
              graphql.org
            </div>
          </div>
        </div>
      </div>

      <div className="z-10">
        <div
          className="mb-3 font-mono text-[11px] uppercase text-white/55"
          style={{ letterSpacing: "0.04em" }}
        >
          Trusted in production
        </div>
        <div className="grid grid-cols-5 grid-rows-2 items-center gap-x-2 gap-y-3">
          {TRUSTED_LOGOS.map(({ name, Component, height }) => (
            <div
              key={name}
              className="flex h-[38px] min-w-0 items-center justify-center overflow-hidden"
              aria-label={name}
            >
              <Component
                className="max-h-full w-auto max-w-full shrink"
                style={{ height, filter: "brightness(0) invert(1)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </BannerFrame>
  )
}

function ArrowRightLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="4" y1="12" x2="19" y2="12" />
      <polyline points="13,6 19,12 13,18" />
    </svg>
  )
}
