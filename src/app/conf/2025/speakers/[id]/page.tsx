import { Metadata } from "next"
import { notFound } from "next/navigation"
import React from "react"

import { speakers, speakerSessions } from "../../_data"
import { metadata as layoutMetadata } from "../../layout"

import { HERO_MARQUEE_ITEMS } from "../../utils"
import { BackLink } from "../../schedule/_components/back-link"
import { NavbarPlaceholder } from "../../components/navbar"
import { CtaCardSection } from "../../components/cta-card-section"
import clsx from "clsx"
import { SchedSpeaker } from "@/app/conf/2023/types"
import { Button } from "@/app/conf/_design-system/button"
import { MarqueeRows } from "../../components/marquee-rows"
import { GET_TICKETS_LINK } from "../../links"
import { SpeakerTags } from "../../components/speaker-tags"
import { SpeakerLinks } from "../../components/speaker-links"
import { LongSessionCard } from "./long-session-card"
import Image from "next-image-export-optimizer"

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
  const speaker = speakers.find(s => s.username === params.id)
  if (!speaker) {
    notFound()
  }

  return (
    <>
      {/* gql-conf-navbar-strip border-t border-neu-200 bg-neu-0 py-8 text-neu-900 before:bg-white/40 dark:border-neu-100 before:dark:bg-blk/30 xl:py-16 */}
      <NavbarPlaceholder className="top-0 bg-neu-50 before:bg-neu-50/40 dark:bg-neu-0 dark:before:bg-blk/30" />
      <main className="gql-all-anchors-focusable gql-conf-navbar-strip text-neu-900 before:bg-neu-50/40 before:dark:bg-blk/30">
        <div className="bg-neu-50 dark:bg-neu-0">
          <div className="gql-conf-container">
            <div className="gql-conf-section !py-0">
              <div className="border-x border-neu-200 pt-8 dark:border-neu-100 2xl:pt-16">
                <SpeakerHeader speaker={speaker} year="2025" />

                <div>
                  <SpeakerLinks size="lg" speaker={speaker} />
                </div>
                <p className="typography-body-lg mt-8 p-4 lg:p-8 xl:px-24 xl:pb-24 xl:pt-16 xl:text-[32px]">
                  {speaker.about}
                </p>

                <Hr />

                <h3 className="typography-h2 my-8 max-w-[408px] px-2 sm:px-3 lg:my-16">
                  2025 Sessions
                </h3>
                <SpeakerSessions speaker={speaker} className="-mx-px -mb-px" />

                <Hr />

                <h3 className="typography-h2 my-8 max-w-[408px] px-2 sm:px-3 lg:my-16">
                  Sessions from previous editions
                </h3>
                <SpeakerSessions speaker={speaker} className="-mx-px -mb-px" />
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
      <div>
        <BackLink year="2025" kind="schedule" />
        <p className="typography-h3 mt-4 lg:mt-20">Meet the speaker</p>
        <h1 className="typography-h1 mt-2">{speaker.name}</h1>
        <div className="flex flex-wrap items-center justify-between gap-2 lg:gap-x-4 xl:gap-x-8">
          {[speaker.position, speaker.company === "-" ? "" : speaker.company]
            .filter(Boolean)
            .join(", ")}
          <SpeakerTags speaker={speaker} />
        </div>
      </div>
      {speaker.avatar && (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 z-[1] bg-sec-lighter opacity-90 mix-blend-multiply" />
          <Image
            src={speaker.avatar}
            alt=""
            width={464}
            height={464}
            className="aspect-square size-[464px] w-full object-cover saturate-[0.1] transition-transform"
          />
        </div>
      )}
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
          <LongSessionCard key={session.id} session={session} year="2025" />
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
