import Image from "next/image"
import clsx from "clsx"

import { Tag } from "@/app/conf/_design-system/tag"
import { CalendarIcon } from "@/app/conf/_design-system/pixelarticons/calendar-icon"
import { PinIcon } from "@/app/conf/_design-system/pixelarticons/pin-icon"
import { StripesDecoration } from "@/app/conf/_design-system/stripes-decoration"
import { formatDescription } from "@/app/conf/2026/schedule/[id]/format-description"

import {
  SingaporeSession,
  SingaporeSpeaker,
  singaporeSessions,
} from "./schedule-data"

const TIME_RANGE = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Singapore",
})

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  timeZone: "Asia/Singapore",
})

export function ScheduleSection() {
  return (
    <section
      id="schedule"
      className="gql-section scroll-mt-20 max-xs:px-0 xl:py-12"
    >
      <div className="border-neu-200 dark:border-neu-100 xs:border-x">
        <div className="flex flex-wrap items-baseline justify-between gap-4 px-2 pt-8 sm:px-3 lg:pt-12 2xl:pt-16">
          <h2 className="typography-h2">Schedule</h2>
          <p className="typography-body-md text-neu-700">
            All times in Singapore Time (SGT, UTC+8)
          </p>
        </div>

        {singaporeSessions.map((session, i) => (
          <SessionBlock key={session.id} session={session} isFirst={i === 0} />
        ))}
      </div>
    </section>
  )
}

function SessionBlock({
  session,
  isFirst,
}: {
  session: SingaporeSession
  isFirst: boolean
}) {
  return (
    <article>
      <Hr className={isFirst ? "mt-8 lg:mt-12" : "mt-12 lg:mt-16"} />
      <SessionHeader session={session} className="px-2 pt-8 sm:px-3 lg:pt-12" />
      {session.description && (
        <div
          className="typography-body-lg mt-8 flex flex-col gap-4 px-2 pb-8 sm:px-3 lg:mt-12 xl:pb-12 [&_a]:break-words"
          dangerouslySetInnerHTML={{
            __html: formatDescription(session.description),
          }}
        />
      )}
      {session.speakers.length > 0 && (
        <SessionSpeakers
          speakers={session.speakers}
          className="-mx-px -mb-px border-t border-neu-200 dark:border-neu-100"
        />
      )}
    </article>
  )
}

function SessionHeader({
  session,
  className,
}: {
  session: SingaporeSession
  className?: string
}) {
  const start = new Date(session.start)
  const end = new Date(session.end)

  return (
    <header className={className}>
      <p className="typography-h3 text-neu-700">
        {session.speakers.map((s, i) => (
          <span key={s.id}>
            {s.name}
            {i !== session.speakers.length - 1 && <span>, </span>}
          </span>
        ))}
      </p>
      <h3 className="typography-h2 mb-6 mt-3">{session.title}</h3>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="typography-body-md flex flex-col gap-2 md:flex-row md:gap-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-5 text-sec-darker dark:text-sec-light/90 sm:size-6" />
            <time dateTime={session.start}>
              {DATE_FORMAT.format(start)}
              {", "}
              {TIME_RANGE.formatRange(start, end)}
            </time>
          </div>
          {session.venue && (
            <div className="flex items-center gap-2">
              <PinIcon className="size-5 text-sec-darker dark:text-sec-light/90 sm:size-6" />
              <span>{session.venue}</span>
            </div>
          )}
        </div>
        <Tag color="hsl(var(--color-pri-base))">{session.type}</Tag>
      </div>
    </header>
  )
}

function SessionSpeakers({
  speakers,
  className,
}: {
  speakers: SingaporeSpeaker[]
  className?: string
}) {
  return (
    <div
      className={clsx(
        "grid lg:grid-cols-2 lg:gap-5 max-lg:[&>*:not(:last-child)]:border-b-0",
        className,
      )}
    >
      {speakers.map((speaker, i) => (
        <SpeakerCard key={speaker.id} speaker={speaker} index={i} />
      ))}
    </div>
  )
}

const STRIPE_VARIANTS: { mask: string; endColor: string }[] = [
  {
    mask: "linear-gradient(120deg, hsl(var(--color-pri-base)) 0%, hsl(var(--color-pri-base)) 8%, transparent 35%, transparent)",
    endColor: "hsl(var(--color-sec-base))",
  },
  {
    mask: "radial-gradient(circle at bottom right, hsl(var(--color-pri-base)) 0%, hsl(var(--color-pri-base)) 10%, transparent 40%, transparent)",
    endColor: "hsl(var(--color-sec-darker))",
  },
  {
    mask: "linear-gradient(-40deg, hsl(var(--color-pri-base)) 0%, hsl(var(--color-pri-base)) 5%, transparent 40%, transparent)",
    endColor: "hsl(var(--color-sec-light))",
  },
]

function SpeakerCard({
  speaker,
  index,
}: {
  speaker: SingaporeSpeaker
  index: number
}) {
  const variant = STRIPE_VARIANTS[index % STRIPE_VARIANTS.length]
  const subtitle = [
    speaker.company === "-" ? "" : speaker.company,
    speaker.jobtitle,
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <article className="group relative overflow-hidden border border-neu-200 bg-neu-0 @container dark:border-neu-100">
      <div className="flex h-full flex-col gap-4 p-4 @[420px]:flex-row md:gap-6 md:p-6">
        <div className="relative aspect-square h-full overflow-hidden @[420px]:w-[176px] @[420px]:shrink-0">
          <div className="absolute inset-0 z-[1] bg-sec-light mix-blend-multiply" />
          <Image
            src={speaker.avatar}
            alt=""
            width={176}
            height={176}
            placeholder="blur"
            className="size-full object-cover saturate-[.1]"
          />
          <div
            role="presentation"
            className="pointer-events-none absolute inset-0 inset-y-[-20px]"
            style={
              {
                maskImage: variant.mask,
                WebkitMaskImage: variant.mask,
                "--end-color": variant.endColor,
              } as React.CSSProperties
            }
          >
            <StripesDecoration oddClassName="absolute inset-0 bg-gradient-to-b from-sec-dark to-[var(--end-color)]" />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-1">
            <h5 className="typography-body-lg">{speaker.name}</h5>
            {subtitle && (
              <p className="typography-body-sm line-clamp-2 text-neu-800">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function Hr({ className }: { className?: string }) {
  return (
    <hr
      className={clsx(
        "ml-[-50vw] w-[200vw] border-neu-200 dark:border-neu-100",
        className,
      )}
    />
  )
}
