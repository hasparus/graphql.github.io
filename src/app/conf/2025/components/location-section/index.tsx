import { ReactNode } from "react"
import Image from "next-image-export-optimizer"
import { clsx } from "clsx"

import { Button } from "@/app/conf/_design-system/button"

import ArrowDown from "../pixelarticons/arrow-down.svg?svgr"
import locationPhoto from "./location-photo.webp"

export interface LocationSectionProps
  extends React.HTMLAttributes<HTMLElement> {}

export function LocationSection(props: LocationSectionProps) {
  return (
    <section
      {...props}
      className={clsx(
        "gql-conf-section relative bg-sec-light dark:bg-sec-darker",
        props.className,
      )}
    >
      <Image
        src={locationPhoto}
        alt=""
        width={1920}
        height={752}
        role="presentation"
        className="absolute inset-0"
      />
      <div className="border border-sec-light p-4 dark:border-sec-darker lg:p-16">
        <article>
          <h2 className="typography-h2">A place of innovation & creation</h2>
          <p className="mt-6"></p>
          <p className="mt-6"></p>
          <Button href="https://maps.app.goo.gl/W7nX1NejhWw9PqxF7">
            Google Maps
          </Button>
        </article>
        <div>
          <h3>How to get to the venue?</h3>
          <Accordion
            items={[
              {
                title: "Public Transportation",
                description:
                  'Take tram 26 from Amsterdam Central Station to the "Kattenburgerstraat" stop. The venue is in front of the tram stop.',
              },
              {
                title: "Airport Information",
                description:
                  "Amsterdam Airport Schiphol is about 20 km from the venue. Take a direct train to Amsterdam Central Station, then follow the public transportation instructions.",
              },
              {
                title: "Parking at venue",
                description: `Limited parking is available at the venue. We recommend using public transportation when possible. Learn more about parking at <a class="typography-link" href="https://dezwijger.nl/about-us-en/contact" target="_blank">Pakhuis de Zwijger</a>. If you require an accessible parking spot, park at Vriesseveem 4 or Withoedenveem 16 where you can park if you have a Disability Parking Card.`,
              },
            ]}
          />
        </div>
      </div>
    </section>
  )
}

function Accordion({
  items,
}: {
  items: { title: string; description: ReactNode }[]
}) {
  return (
    <div className="grow space-y-4 lg:space-y-6">
      {items.map((question, index) => (
        <details
          open={index === 0}
          key={index}
          className="group/q w-full border border-neu-400 @container"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 border-neu-400 p-2 px-3 focus:outline-none group-open/q:border-b [&::-webkit-details-marker]:hidden">
            <span className="select-none typography-body-lg">
              {question.title}
            </span>
            <ArrowDown className="size-10 shrink-0 text-sec-darker group-open/q:rotate-180" />
          </summary>
          <div className="p-3 typography-body-md">{question.description}</div>
        </details>
      ))}
    </div>
  )
}
