import React from "react"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import clsx from "clsx"

import { metadata as layoutMetadata } from "@/app/conf/2023/layout"

import { speakers, schedule } from "../../_data"
import { ScheduleSession } from "../../../2023/types"

import { SessionVideo } from "./session-video"
import { NavbarPlaceholder } from "../../components/navbar"
import { BackLink } from "../_components/back-link"
import { Tag } from "@/app/conf/_design-system/tag"
import { eventsColors } from "../../utils"
import { PinIcon } from "../../pixelarticons/pin-icon"
import { CalendarIcon } from "../../pixelarticons/calendar-icon"
import { SpeakerCard } from "../../components/speaker-card"
import { Anchor } from "@/app/conf/_design-system/anchor"

function getEventTitle(event: ScheduleSession, speakers: string[]): string {
  let { name } = event

  if (!speakers) {
    return name
  }

  speakers?.forEach(speaker => {
    const speakerInTitle = name.indexOf(`- ${speaker.replace("ı", "i")}`)
    if (speakerInTitle > -1) {
      name = name.slice(0, speakerInTitle)
    }
  })

  return name
}

type SessionProps = { params: { id: string } }

export function generateMetadata({ params }: SessionProps): Metadata {
  const event = schedule.find(s => s.id === params.id)!

  const keywords = [
    event.event_type,
    event.audience,
    event.event_subtype,
    ...(event.speakers || []).map(s => s.name),
  ].filter(Boolean)

  return {
    title: event.name,
    description: event.description,
    keywords: [...layoutMetadata.keywords, ...keywords],
    openGraph: {
      images: `/img/__og-image/2024/${event.id}.png`,
    },
  }
}

export function generateStaticParams() {
  return schedule.filter(s => s.id).map(s => ({ id: s.id }))
}

export default function SessionPage({ params }: SessionProps) {
  const event = schedule.find(s => s.id === params.id)
  if (!event) {
    notFound()
  }

  // @ts-expect-error -- fixme
  event.speakers = (event.speakers || []).map(speaker =>
    speakers.find(s => s.username === speaker.username),
  )

  const eventTitle = getEventTitle(
    event,
    event.speakers!.map(s => s.name),
  )

  return (
    <main className="gql-all-anchors-focusable">
      <NavbarPlaceholder className="top-0 bg-neu-0 before:bg-white/40 dark:bg-neu-0 dark:before:bg-blk/30" />
      <div className="gql-conf-container gql-conf-navbar-strip text-neu-900 before:bg-white/40 before:dark:bg-blk/30">
        <div className="mx-auto max-w-[1088px] py-10">
          <section className="mx-auto min-h-[80vh] flex-col justify-center px-2 sm:px-0 lg:justify-between">
            <SessionHeader event={event} eventTitle={eventTitle} year="2025" />
            <SessionVideo event={event} eventTitle={eventTitle} />

            <div className="mt-8 flex gap-4 max-lg:flex-col lg:mt-16 lg:gap-8">
              <h3 className="typography-h2 min-w-[320px]">
                Session description
              </h3>
              <p className="typography-body-lg">{event.description}</p>
            </div>

            <h3 className="typography-h2 my-8 max-w-[408px] lg:my-16">
              Session speakers
            </h3>
            <SessionSpeakers event={event} />

            <div className="py-8">
              {event.files?.map(({ path }) => (
                <div key={path}>
                  <a href={path} target="_blank" rel="noreferrer">
                    View Full PDF{" "}
                    <span className="font-sans text-2xl font-light">↗</span>
                  </a>
                  <iframe src={path} className="aspect-video size-full" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

function SessionTags({ session }: { session: ScheduleSession }) {
  const eventType = session.event_type.endsWith("s")
    ? session.event_type.slice(0, -1)
    : session.event_type

  return (
    <div className="flex flex-wrap gap-3">
      {eventType && (
        <Tag color={eventsColors[session.event_type]}>{eventType}</Tag>
      )}
      {session.audience && (
        <Tag
          color={eventsColors[session.audience] || "hsl(var(--color-neu-700))"}
        >
          {session.audience}
        </Tag>
      )}
      {session.event_subtype && (
        <Tag
          color={
            eventsColors[session.event_subtype] || "hsl(var(--color-sec-base))"
          }
        >
          {session.event_subtype}
        </Tag>
      )}
    </div>
  )
}

function SessionHeader({
  event,
  eventTitle,
  year,
}: {
  event: ScheduleSession
  eventTitle: string | null
  year: number | `${number}`
}) {
  const speakers = event.speakers || []

  return (
    <header>
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
      <h1 className="typography-h2 mb-6 mt-3">{eventTitle}</h1>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="typography-body-md flex flex-col gap-4 md:flex-row md:gap-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-5 text-sec-darker dark:text-sec-light/90 sm:size-6" />
            <time dateTime="2025-09-08">September 08</time>
            <span>-</span>
            <time dateTime="2025-09-10">10, 2025</time>
          </div>
          <div className="flex items-center gap-2">
            <PinIcon className="size-5 text-sec-darker dark:text-sec-light/90 sm:size-6" />
            <span>{event.venue}</span>
          </div>
        </div>
        <SessionTags session={event} />
      </div>
    </header>
  )
}

function SessionSpeakers({ event }: { event: ScheduleSession }) {
  return (
    <div className="flex flex-col flex-wrap gap-5 lg:flex-row">
      {event.speakers?.map(speaker => (
        <SpeakerCard key={speaker.username} speaker={speaker} year="2025" />
      ))}
    </div>
  )
}
