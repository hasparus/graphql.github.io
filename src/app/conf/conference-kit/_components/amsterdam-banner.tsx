import { GraphQLLogo } from "@/app/conf/2026/components/graphql-conf-logo-link"
import NotesIcon from "@/app/conf/_design-system/pixelarticons/notes.svg?svgr"
import TournamentIcon from "@/app/conf/_design-system/pixelarticons/tournament.svg?svgr"
import ModemIcon from "@/app/conf/_design-system/pixelarticons/modem.svg?svgr"
import ZapIcon from "@/app/conf/_design-system/pixelarticons/zap.svg?svgr"
import { CalendarIcon } from "@/app/conf/_design-system/pixelarticons/calendar-icon"
import { PinIcon } from "@/app/conf/_design-system/pixelarticons/pin-icon"
import { Tag } from "@/app/conf/_design-system/tag"
import fostLogo from "@/app/day/2026/assets/fost-logo.avif"

import { BannerFrame } from "./banner-frame"
import { AmsterdamSkyline } from "./amsterdam-skyline"
import { QRPlaceholder } from "./qr-placeholder"
import { BannerTrustedFooter } from "./trusted-logos"
import Image from "next/image"

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

export function AmsterdamBanner() {
  return (
    <BannerFrame
      slug="amsterdam"
      caption="GraphQL Day Amsterdam 2026"
      className="flex flex-col bg-[#0A0B08] px-9 pt-9 text-white"
    >
      <BgGlow />

      <div className="z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <GraphQLLogo className="size-7" />
          <span className="text-2xl font-medium tracking-tight">GraphQL</span>
        </div>
        <div className="flex items-center gap-1">
          <Tag color={"hsl(var(--color-pri-base))"}>keynotes</Tag>
          <Tag color={"hsl(var(--color-sec-dark))"}>workshops</Tag>
          <Tag color={"hsl(var(--color-neu-500))"}>community</Tag>
        </div>
      </div>

      <div className="absolute z-10" style={{ top: 130 }}>
        <h2 className="m-0 text-[60px] font-medium leading-none tracking-tight">
          GraphQL Day
        </h2>
        <div className="mt-0.5 text-[60px] font-medium leading-none tracking-tight text-pri-base">
          Amsterdam
        </div>
        <div
          className="mt-2 text-[54px] font-medium leading-none text-sec-base"
          style={{ letterSpacing: "-0.02em" }}
        >
          2026
        </div>
      </div>

      {/* Description + tags */}
      <div className="absolute z-10" style={{ top: 380 }}>
        <p
          className="typography-body-lg m-0 text-white/80"
          style={{ lineHeight: 1.4, textWrap: "pretty" }}
        >
          Community-organized GraphQL events at conferences worldwide.
        </p>
        <div
          className="mt-5 flex flex-wrap items-center gap-2.5 font-mono text-[13px] text-sec-base"
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

      <div
        className="absolute z-10 grid grid-cols-[44%_1fr] overflow-hidden border border-white/10 bg-white/[0.025]"
        style={{ top: 810, height: 180 }}
      >
        <div className="relative bg-sec-darker/15 p-2.5">
          <AmsterdamSkyline
            className="text-sec-darker"
            moonClassName="text-sec-dark"
          />
        </div>
        <div className="flex flex-col gap-2 border-l border-white/10 p-[18px_18px_16px]">
          <div className="flex items-start gap-2.5">
            <CalendarIcon className="size-5 translate-y-0.5 text-sec-base" />
            <div className="typography-body-md">Jun 9–10, 2026</div>
          </div>
          <div className="flex items-start gap-2.5">
            <PinIcon className="size-5 translate-y-0.5 text-sec-base" />
            <div className="typography-body-md">
              Amsterdam,
              <br />
              The Netherlands
            </div>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2 border-t border-white/10 pt-2">
            <span
              className="typography-menu translate-y-px text-xs text-white/60"
              style={{ letterSpacing: "0.04em" }}
            >
              hosted at
            </span>
            <Image
              src={fostLogo}
              alt="FOST"
              width={60}
              height={20}
              placeholder="empty"
            />
          </div>
        </div>
      </div>

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
              Visit the event
            </div>
            <div
              className="mt-1 text-[12px] text-white/70"
              style={{ lineHeight: 1.3 }}
            >
              Let&rsquo;s build the future
              <br />
              of APIs together.
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

// Concentric magenta glow drifting off the upper-right edge.
function BgGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute rounded-full"
        style={{
          right: "-20%",
          top: "12%",
          width: 900,
          height: 900,
          background:
            "radial-gradient(closest-side, rgba(225,0,152,0.35) 0%, rgba(225,0,152,0.15) 35%, rgba(225,0,152,0.05) 60%, transparent 72%)",
          filter: "blur(2px)",
        }}
      />
      <svg
        className="absolute"
        style={{ right: "-32%", top: "6%", width: 720, height: 720 }}
        viewBox="0 0 720 720"
        fill="none"
      >
        {[120, 180, 240, 300, 360].map((r, i) => (
          <ellipse
            key={i}
            cx="360"
            cy="360"
            rx={r}
            ry={r * 1.25}
            stroke="rgba(225,0,152,0.45)"
            strokeWidth="1.4"
            opacity={0.35 + i * 0.1}
          />
        ))}
      </svg>
    </div>
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
