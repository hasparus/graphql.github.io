import { Metadata } from "next"
import { notFound } from "next/navigation"
import React from "react"

import { speakers, speakerSessions } from "../../_data"
import { metadata as layoutMetadata } from "../../layout"

import { eventsColors, HERO_MARQUEE_ITEMS } from "../../utils"
import { BackLink } from "../../schedule/_components/back-link"
import { NavbarPlaceholder } from "../../components/navbar"
import { CtaCardSection } from "../../components/cta-card-section"
import clsx from "clsx"
import { SchedSpeaker } from "@/app/conf/2023/types"
import { Button } from "@/app/conf/_design-system/button"
import { MarqueeRows } from "../../components/marquee-rows"
import { GET_TICKETS_LINK } from "../../links"
import { Anchor } from "@/app/conf/_design-system/anchor"
import { SpeakerTags } from "../../components/speaker-tags"

type SpeakerProps = { params: { id: string } }

export function generateMetadata({ params }: SpeakerProps): Metadata {
  const decodedId = decodeURIComponent(params.id)
  const speaker = speakers.find(s => s.username === decodedId)!

  const keywords = [speaker.name, speaker.company, speaker.position].filter(
    Boolean,
  ) as string[]

  return {
    title: speaker.name,
    description: speaker.about,
    keywords: [...layoutMetadata.keywords, ...keywords],
    openGraph: {
      images: `/img/__og-image/2024/${speaker.username}.png`,
    },
  }
}

export function generateStaticParams() {
  return speakers.map(s => ({ id: s.username }))
}

export default function SpeakerPage({ params }: SpeakerProps) {
  const event = speakers.find(s => s.username === params.id)
  if (!event) {
    notFound()
  }

  return (
    <>
      <NavbarPlaceholder className="top-0 bg-neu-50 before:bg-white/40 dark:bg-neu-0 dark:before:bg-blk/30" />
      <main className="gql-all-anchors-focusable gql-conf-navbar-strip text-neu-900 before:bg-white/40 before:dark:bg-blk/30">
        <div className="bg-neu-50 dark:bg-neu-0">
          <div className="gql-conf-container">
            <div className="gql-conf-section !py-0">
              <div className="border-x border-neu-200 pt-8 dark:border-neu-100 2xl:pt-16">
                <SpeakerHeader speaker={event} year="2025" />

                <div>
                  
                </div>
                <p className="typography-body-lg mt-8 p-4 lg:p-8 xl:px-24 xl:pb-24 xl:pt-16 xl:text-[32px]">
                  {event.about}
                </p>

                <Hr />

                <h3 className="typography-h2 my-8 max-w-[408px] px-2 sm:px-3 lg:my-16">
                  2025 Sessions
                </h3>
                <SpeakerSessions speaker={event} className="-mx-px -mb-px" />

                <Hr />

                <h3 className="typography-h2 my-8 max-w-[408px] px-2 sm:px-3 lg:my-16">
                  Sessions from previous editions
                </h3>
                <SpeakerSessions speaker={event} className="-mx-px -mb-px" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neu-200 bg-neu-0 py-8 dark:border-neu-100 xl:py-16">
          <div className="gql-conf-container">
            <CtaCardSection
              title="Get your ticket"
              description="Join three transformative days of expert insights and innovation to shape the next decade of APIs!"
            >
              <Button variant="primary" href={GET_TICKETS_LINK}>
                Get tickets
              </Button>
            </CtaCardSection>
            <div className="py-8">
              <MarqueeRows variant="secondary" items={HERO_MARQUEE_ITEMS} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

function SpeakerHeader({
  speaker,
  year,
  className,
}: {
  speaker: SchedSpeaker
  year: `20${number}`
  className?: string
}) {
  return (
    <header className={className}>
      <BackLink year="2025" kind="schedule" />
      <p
        className={clsx(
          "mt-8 text-neu-700",
          speakers.length >= 4 ? "typography-body-lg" : "typography-h3",
        )}
      >
        {speakers.map((s, i) => (
          <React.Fragment key={s.username}>
            <Anchor
              href={`/conf/${year}/speakers/${s.username}`}
              className="decoration-neu-500 hover:underline dark:decoration-neu-100"
            >
              {s.name}
            </Anchor>
            {i !== speakers.length - 1 && <span>, </span>}
          </React.Fragment>
        ))}
      </p>
      <p className="typography-h3">Meet the speaker</p>
      <h1 className="typography-h1 mt-2">{speaker.name}</h1>
      <div className="flex flex-wrap items-center justify-between gap-2 lg:gap-x-4 xl:gap-x-8">
        {[speaker.position, speaker.company === "-" ? "" : speaker.company]
          .filter(Boolean)
          .join(", ")}
        <SpeakerTags speaker={speaker} />
      </div>
    </header>
  )
}

function SpeakerSessions({
  speaker,
  className,
}: {
  speaker: SchedSpeaker
  className?: string
}) {
  return (
    <div
      className={clsx(
        "grid max-lg:*:border-y-0 lg:grid-cols-2 lg:gap-5",
        className,
      )}
    >
      {speakerSessions
        .get(speaker.username)
        ?.map(session => (
          <SpeakerCard key={session.id} session={session} year="2025" />
        ))}
    </div>
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
