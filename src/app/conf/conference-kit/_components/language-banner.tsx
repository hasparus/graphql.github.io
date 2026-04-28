import NotesIcon from "@/app/conf/_design-system/pixelarticons/notes.svg?svgr"
import TournamentIcon from "@/app/conf/_design-system/pixelarticons/tournament.svg?svgr"
import ModemIcon from "@/app/conf/_design-system/pixelarticons/modem.svg?svgr"
import ZapIcon from "@/app/conf/_design-system/pixelarticons/zap.svg?svgr"
import { GraphQLWordmarkLogo } from "@/icons"
import { CityQuery } from "@/components/code-blocks"

import { BannerFrame } from "./banner-frame"
import { BlobStripes } from "./blob-stripes"
import { QRPlaceholder } from "./qr-placeholder"
import { BannerTrustedFooter } from "./trusted-logos"

const features = [
  {
    Icon: NotesIcon,
    label: "Typesafe\nschemas",
    iconClassName: "text-pri-base",
  },
  {
    Icon: TournamentIcon,
    label: "Distributed\nby design",
    iconClassName: "text-pri-base",
  },
  {
    Icon: ModemIcon,
    label: "Data\ncolocation",
    iconClassName: "text-pri-base",
  },
  {
    Icon: ZapIcon,
    label: "Performance\nat scale",
    iconClassName: "text-sec-base",
  },
] as const

export function LanguageBanner() {
  return (
    <BannerFrame
      slug="language"
      caption="GraphQL — the query language"
      className="flex flex-col bg-[#0A0B08] px-9 pt-9 text-white"
    >
      <BlobStripes
        position="70% 30%"
        size="155%"
        stripeWidth="14px"
        evenClassName="bg-[linear-gradient(180deg,rgba(225,0,152,0.22)_0%,rgba(225,0,152,0.04)_100%)]"
        oddClassName="bg-[linear-gradient(180deg,rgba(225,0,152,0.06)_0%,rgba(132,0,89,0.18)_100%)]"
      />

      <div className="z-10 flex items-center justify-between">
        <GraphQLWordmarkLogo className="h-8 !fill-white" />
        <div
          className="flex flex-wrap items-center gap-2.5 font-mono text-[13px] text-sec-base"
          style={{ letterSpacing: "0.02em" }}
        >
          <span>schema-first</span>
          <span className="text-pri-base">•</span>
          <span>typesafe</span>
          <span className="text-pri-base">•</span>
          <span>flexible</span>
          <span className="text-pri-base">•</span>
          <span>fast</span>
        </div>
      </div>

      <div className="absolute z-10" style={{ top: 130 }}>
        <h2 className="m-0 text-[60px] font-medium leading-none tracking-tight">
          The query
        </h2>
        <div className="mt-0.5 text-[60px] font-medium leading-none tracking-tight text-pri-base">
          language
        </div>
        <div
          className="mt-2 text-[54px] font-medium leading-none text-sec-base"
          style={{ letterSpacing: "-0.02em" }}
        >
          for your API
        </div>
      </div>

      <div className="absolute z-10" style={{ top: 380 }}>
        <p
          className="typography-body-lg m-0 text-white/80"
          style={{ lineHeight: 1.4, textWrap: "pretty" }}
        >
          An open-standard query language and runtime that lets clients ask for
          exactly the data they need — and nothing more.
        </p>
      </div>

      <div
        className="absolute z-10 grid grid-cols-4 gap-2"
        style={{ top: 590 }}
      >
        {features.map(({ Icon, label, iconClassName }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-3.5 px-1 py-2"
          >
            <div className="flex size-12 items-center justify-center">
              <Icon className={`block size-9 ${iconClassName}`} />
            </div>
            <div
              className="whitespace-pre-line text-center text-[13px] text-white/85"
              style={{ lineHeight: 1.25 }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-9 z-10" style={{ top: 810 }}>
        <CityQuery />
      </div>
      {/* Force shiki's dark theme tokens for this banner only — the page renders
          light-themed by default, but this banner is dark. */}
      <style>{`
        [data-print-banner="language"] .nextra-code span {
          background-color: var(--shiki-dark-bg);
          color: var(--shiki-dark);
        }
      `}</style>

      <div
        className="absolute z-10 grid grid-cols-2 gap-2.5"
        style={{ top: 1020 }}
      >
        <div className="flex h-24 items-center gap-3.5 border border-white/10 bg-white/[0.02] p-3.5">
          <div className="flex size-16 shrink-0 items-center justify-center border-[1.5px] border-pri-base">
            <ArrowRightLine className="size-7 text-pri-base" />
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

      <BannerTrustedFooter />
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
