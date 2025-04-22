import { clsx } from "clsx"
import NextImage from "next-image-export-optimizer"

import { Button } from "../../../_design-system/button"
import { GET_TICKETS_LINK, BECOME_A_SPEAKER_LINK } from "../../links"

import speakerImage from "./speaker.webp"

export interface RegisterTodayProps {
  className?: string
}

export function RegisterToday({ className }: RegisterTodayProps) {
  return (
    <section
      className={clsx(
        "flex gap-10 px-4 max-lg:flex-col-reverse lg:px-12 xl:gap-x-24 xl:px-24",
        className,
      )}
    >
      {/* todo: test if the placeholder works in deploy preview */}
      <NextImage
        src={speakerImage}
        alt="GraphQL Conference"
        width="450"
        height="566"
        className="aspect-[312/392] w-full object-cover max-sm:hidden sm:aspect-[2] lg:aspect-[450/566] lg:h-[566px] lg:w-[450px]"
      />
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="typography-h2 text-neu-900">
            Let's celebrate 10 years of GraphQL together
          </h2>
          <p className="typography-h3 text-neu-800 mt-6 md:mt-10">
            Join three transformative days of expert insights and innovation to
            shape the next decade of APIs!
          </p>
        </div>
        <div className="mt-10 flex gap-x-6 gap-y-4 max-sm:flex-col">
          <Button href={GET_TICKETS_LINK}>Register today</Button>
          <Button variant="secondary" href={BECOME_A_SPEAKER_LINK}>
            Become a speaker
          </Button>
        </div>
      </div>
    </section>
  )
}
