import { notFound } from "next/navigation"
import { Metadata } from "next"
import clsx from "clsx"
import { format, parseISO } from "date-fns"

import { metadata as layoutMetadata } from "@/app/conf/2023/layout"
import { Avatar } from "../../../_components/speakers/avatar"
import {
  SocialMediaIcon,
  SocialMediaIconServiceType,
} from "../../../_components/speakers/social-media"
import { speakers, schedule } from "../../_data"
import { ScheduleSession } from "../../../2023/types"

import { SessionVideo } from "./session-video"
import { NavbarPlaceholder } from "../../components/navbar"
import { BackLink } from "../_components/back-link"
import { Tag } from "@/app/conf/_design-system/tag"
import { eventsColors } from "../../utils"

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

  const eventType = event.event_type.endsWith("s")
    ? event.event_type.slice(0, -1)
    : event.event_type

  const eventTitle = getEventTitle(
    event,
    event.speakers!.map(s => s.name),
  )

  return (
    <main className="gql-all-anchors-focusable">
      <NavbarPlaceholder className="top-0 bg-neu-0 before:bg-white/40 dark:bg-pri-darker dark:before:bg-blk/30" />
      <div className="gql-conf-container gql-conf-navbar-strip text-neu-900 before:bg-white/40 before:dark:bg-blk/30">
        <div className="py-10">
          <section className="xs:px-0 mx-auto min-h-[80vh] flex-col justify-center px-2 md:container lg:justify-between">
            <BackLink year="2025" kind="schedule" />
            <SessionVideo event={event} eventTitle={eventTitle} />

            <div className="mx-auto mt-10 flex flex-col self-center sm:space-y-4">
              <div className="space-y-5">
                <div className="flex flex-wrap gap-3">
                  {eventType && (
                    <Tag color={eventsColors[event.event_type]}>
                      {eventType}
                    </Tag>
                  )}
                  {event.audience && (
                    <Tag
                      color={
                        eventsColors[event.audience] ||
                        "hsl(var(--color-neu-700))"
                      }
                    >
                      {event.audience}
                    </Tag>
                  )}
                  {event.event_subtype && (
                    <Tag
                      color={
                        eventsColors[event.event_subtype] ||
                        "hsl(var(--color-sec-base))"
                      }
                    >
                      {event.event_subtype}
                    </Tag>
                  )}
                </div>
                <h1 className="mt-0 typography-h1">{eventTitle}</h1>
                <time dateTime={event.event_start} className="mt-4">
                  {format(
                    parseISO(event.event_start),
                    "EEEE, MMMM d / hh:mmaaaa 'PDT'",
                  )}{" "}
                  - {format(parseISO(event.event_end), "hh:mmaaaa 'PDT'")}
                </time>
              </div>
              <div className="mt-8 flex flex-col flex-wrap gap-5 lg:flex-row">
                {event.speakers!.map(speaker => (
                  <div
                    className={`flex w-full items-center gap-3 ${event?.speakers?.length || 0 > 1 ? "max-w-[320px]" : ""}`}
                    key={speaker.username}
                  >
                    <Avatar
                      className="size-[100px] lg:size-[120px]"
                      avatar={speaker.avatar}
                      name={speaker.name}
                    />

                    <div className="flex flex-col gap-1.5 lg:gap-1">
                      <a
                        href={`/conf/2024/speakers/${speaker.username}`}
                        className="mt-0 typography-body-lg"
                      >
                        {speaker.name}
                      </a>

                      <span className="typography-body-sm">
                        <span>{speaker.company}</span>
                        {speaker.company && ", "}
                        {speaker.position}
                      </span>
                      {speaker.socialurls?.length ? (
                        <div className="mt-0 text-[#333333]">
                          <div className="flex space-x-2">
                            {speaker.socialurls.map(social => (
                              <a
                                key={social.url}
                                href={social.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center text-blk"
                              >
                                <SocialMediaIcon
                                  service={
                                    social.service.toLowerCase() as SocialMediaIconServiceType
                                  }
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
              <p>{event.description}</p>

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
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
