import type { SchedSpeaker } from "@/app/conf/2023/types"
import { CalendarIcon } from "../../_design-system/pixelarticons/calendar-icon"
import { PinIcon } from "../../_design-system/pixelarticons/pin-icon"
import { formatSpeakerPosition } from "./format-speaker-position"
import { GraphQLLogo } from "./graphql-conf-logo-link"

const RIGHT_COLUMN_WIDTH_PX = 476

interface SpeakerOpengraphImageProps extends React.HTMLAttributes<HTMLElement> {
  speaker: SchedSpeaker
  date: string
  year: string
  location: string
}

export default function SpeakerOpengraphImage({
  speaker,
  date,
  year,
  location,
  ...rest
}: SpeakerOpengraphImageProps) {
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

      <div className="flex">
        <div className="flex flex-1 flex-col justify-center">
          <div className="flex flex-1 flex-col justify-center gap-10 pl-10 pr-16">
            <div className="flex w-[454px] flex-col gap-10">
              <h3 className="m-0 font-sans text-[88px] font-normal leading-tight text-neu-900">
                {speaker.name}
              </h3>

              <div className="flex items-center gap-8">
                <span className="font-sans text-[32px] font-normal leading-tight text-neu-700">
                  {formatSpeakerPosition(speaker)}
                </span>
              </div>
            </div>
          </div>

          <footer className="flex items-center border-t-2 border-neu-300 px-16 py-8 pl-10">
            <span className="font-mono text-2xl font-normal uppercase leading-none text-neu-900">
              Speakers
            </span>
          </footer>
        </div>

        {speaker.avatar && (
          <div className="relative flex overflow-hidden border-l-2 border-neu-300">
            <div className="absolute inset-0 z-[1] bg-sec-lighter mix-blend-multiply" />
            <img
              src={speaker.avatar}
              alt=""
              className="object-cover"
              width={RIGHT_COLUMN_WIDTH_PX}
              height={RIGHT_COLUMN_WIDTH_PX}
            />
          </div>
        )}
      </div>
    </article>
  )
}

export function ConferenceOpengraphImageHeader({
  year,
  date,
  location,
}: {
  year: string
  date: string
  location: string
}) {
  return (
    <header className="flex items-center border-b-2 border-neu-300">
      <div className="flex flex-1 items-center gap-6 border-r-2 border-neu-300 p-10 pr-16">
        <div className="flex items-center gap-4">
          <div className="font-mono font-normal uppercase leading-none text-neu-900">
            <div className="flex h-[74px] items-center gap-4 text-[40px]/none uppercase">
              <div className="text-pri-base">
                <GraphQLLogo className="h-12" />
              </div>
              <span>/</span>
              <div>
                GraphQLConf <span className="text-pri-base">{year}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex h-full shrink-0 flex-col justify-center"
        style={{
          width: RIGHT_COLUMN_WIDTH_PX,
        }}
      >
        <div className="flex items-center gap-6 border-b-2 border-neu-300 px-6 py-[26px]">
          <div className="flex items-center gap-2">
            <CalendarIcon
              width="24"
              height="24"
              className="-translate-y-px text-pri-base"
            />
            <span className="font-mono text-xl font-normal uppercase leading-[1.2] text-neu-900">
              {date}, {year}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 px-6 py-[26px]">
          <div className="flex items-center gap-2">
            <PinIcon
              width="24"
              height="24"
              className="translate-y-[-.5px] text-pri-base"
            />
            <span className="font-mono text-xl font-normal uppercase leading-[1.2] text-neu-900">
              {location}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
