import { clsx } from "clsx"
import NextImage from "next-image-export-optimizer"

import { Button } from "../../_design-system/button"

import speakerImage from "./speaker.webp"

export interface RegisterTodayProps {
  className?: string
}

export function RegisterToday({ className }: RegisterTodayProps) {
  return (
    <section
      className={clsx(
        "flex gap-10 px-4 max-lg:flex-col-reverse lg:px-10 xl:gap-x-24 xl:px-24",
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
        <div className="mt-10 flex gap-x-6 gap-y-4 max-md:flex-col">
          <Button href="https://cvent.me/PBNYEe?utm_source=graphql_conf_2025&utm_medium=website&utm_campaign=register_section">
            Register today
          </Button>
          <Button
            variant="secondary"
            href="https://sessionize.com/graphqlconf-2025?utm_medium=website&utm_campaign=speaker_section"
          >
            Become a speaker
          </Button>
        </div>
      </div>
    </section>
  )
}
