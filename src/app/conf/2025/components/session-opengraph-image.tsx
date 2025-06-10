import type { ScheduleSession } from "@/app/conf/2025/schedule/_components/session-list"
import type { SchedSpeaker } from "@/app/conf/2023/types"
import {
  ConferenceOpengraphImageHeader,
  normalizeProtocolRelativeUrl,
} from "./speaker-opengraph-image"
import { getEventTitle } from "../utils"
import { formatSpeakerPosition } from "./format-speaker-position"

interface ScheduleOpengraphImageProps
  extends React.HTMLAttributes<HTMLElement> {
  session: Pick<ScheduleSession, "name" | "speakers" | "event_type">
  date: string
  year: string
  location: string
}

function isString(x: unknown): x is string {
  return Object.prototype.toString.call(x) === "[object String]"
}

export default function ScheduleOpengraphImage({
  session,
  date,
  location,
  year,
  ...rest
}: ScheduleOpengraphImageProps) {
  const speakers = session.speakers
    ? isString(session.speakers)
      ? (session.speakers as string)
          .split(",")
          .map(name => ({ name, username: "", avatar: "" }))
      : (session.speakers as SchedSpeaker[])
    : []

  const eventTitle = getEventTitle(
    session,
    speakers.map(s => s.name),
  )

  return (
    <article
      className="flex h-[630px] w-[1200px] flex-col overflow-hidden border-2 border-neu-300 bg-neu-100"
      {...rest}
    >
      <ConferenceOpengraphImageHeader
        year={year}
        date={date}
        location={location}
      />

      <div className="flex flex-1 flex-col justify-between p-10">
        <div className="flex flex-col gap-10">
          <h3
            className="m-0 font-sans leading-tight text-neu-900"
            style={{
              fontSize: eventTitle.length <= 32 ? "72px" : "32px",
            }}
          >
            {eventTitle}
          </h3>
        </div>

        {speakers.length === 1 && speakers[0] && (
          <div className="flex items-center gap-10">
            {speakers[0]?.avatar && (
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 z-[1] bg-sec-lighter mix-blend-multiply" />
                <img
                  src={normalizeProtocolRelativeUrl(speakers[0].avatar)}
                  alt=""
                  className="size-[120px] object-cover"
                  width={120}
                  height={120}
                />
              </div>
            )}
            <div className="flex flex-col gap-4">
              <h4 className="m-0 font-sans text-[48px] font-normal leading-tight text-neu-900">
                {speakers[0].name}
              </h4>
              {"company" in speakers[0] && speakers[0].company && (
                <span className="font-sans text-[32px] font-normal leading-tight text-neu-700">
                  {formatSpeakerPosition(speakers[0] as SchedSpeaker)}
                </span>
              )}
            </div>
          </div>
        )}

        {speakers.length > 1 && (
          <div className="flex flex-col gap-4">
            <h4
              className="m-0 font-sans font-normal leading-tight text-neu-900"
              style={{
                fontSize: speakers.length < 4 ? "48px" : "32px",
              }}
            >
              {speakers.map(s => s.name).join(", ")}
            </h4>
          </div>
        )}
      </div>

      {session.event_type && (
        <footer className="flex items-center border-t-2 border-neu-300 px-16 py-8 pl-10">
          <span className="font-mono text-2xl font-normal uppercase leading-none text-neu-900">
            {session.event_type}
          </span>
        </footer>
      )}
    </article>
  )
}
