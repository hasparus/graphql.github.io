import type { SchedSpeaker } from "@/app/conf/2023/types"
import { CalendarIcon } from "../../_design-system/pixelarticons/calendar-icon"
import { PinIcon } from "../../_design-system/pixelarticons/pin-icon"
import { formatSpeakerPosition } from "./format-speaker-position"
import { GraphQLLogo } from "./graphql-conf-logo-link"

interface SpeakerOpengraphImageProps extends React.HTMLAttributes<HTMLElement> {
  speaker: SchedSpeaker
  date: string
  location: string
}

export default function SpeakerOpengraphImage({
  speaker,
  date,
  location,
  ...rest
}: SpeakerOpengraphImageProps) {
  return (
    <article
      className="flex h-[630px] w-[1200px] flex-col border border-neu-300 bg-neu-50"
      {...rest}
    >
      <header className="flex h-36 items-center border-b border-neu-300">
        <div className="flex flex-1 items-center gap-6 border-r border-neu-300 p-10 pr-16">
          <div className="flex items-center gap-4">
            <div className="font-mono font-normal uppercase leading-none text-neu-900">
              <div className="flex h-[74px] items-center gap-4 text-[40px]/none uppercase">
                <div className="text-pri-base">
                  <GraphQLLogo className="h-12" />
                </div>
                <span>/</span>
                <div>
                  GraphQLConf{" "}
                  <span className="text-pri-base">{speaker.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-full w-[400px] flex-col justify-center">
          <div className="flex items-center gap-6 border-b border-neu-300 px-6 py-[26px]">
            <div className="flex items-center gap-2">
              <CalendarIcon width="20" height="20" className="text-pri-base" />
              <span className="font-mono text-xl font-normal uppercase leading-tight text-neu-900">
                {date}, {speaker.year}
              </span>
            </div>
          </div>

          <div className="flex h-[76px] items-center gap-6 px-6 py-[26px]">
            <div className="flex items-center gap-2">
              <PinIcon width="20" height="20" className="text-pri-base" />
              <span className="font-mono text-xl font-normal uppercase leading-tight text-neu-900">
                {location}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 justify-between gap-12">
        <div className="flex flex-1 flex-col justify-center">
          <div className="flex flex-1 flex-col justify-center gap-10 p-16 pl-10">
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

          <footer className="flex items-center border-t border-neu-300 px-16 py-8 pl-10">
            <span className="font-mono text-2xl font-normal uppercase leading-none text-neu-900">
              Speakers
            </span>
          </footer>
        </div>

        <img
          src="https://placedog.net/400/400"
          alt={speaker.name}
          className="size-full object-cover"
        />
      </div>
    </article>
  )
}
