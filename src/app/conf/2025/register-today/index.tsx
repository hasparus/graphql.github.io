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
        "flex gap-x-24 gap-y-10 px-4 max-md:flex-col md:px-24",
        className,
      )}
    >
      <NextImage
        src={speakerImage}
        alt="GraphQL Conference"
        width={450}
        height={566}
        className="object-cover"
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
        <div className="flex gap-x-6 gap-y-4 max-md:flex-col">
          <Button>Register today</Button>
          <Button variant="secondary">Become a speaker</Button>
        </div>
      </div>
    </section>
  )
}
