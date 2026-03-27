import { ReactNode } from "react"
import { Accordion } from "@/app/conf/_design-system/accordion"

export function VenueSection({
  name,
  description,
  address,
  mapsEmbed,
  gettingThere,
}: {
  name: string
  description: ReactNode
  address: ReactNode
  mapsEmbed?: string
  gettingThere?: { title: string; description: ReactNode }[]
}) {
  return (
    <section className="gql-section xl:py-12">
      <h3 className="typography-h2 mb-12">Venue & Location</h3>
      <div className="flex gap-x-12 gap-y-10 max-lg:flex-col">
        <article className="flex flex-col gap-6 lg:flex-1">
          <h4 className="typography-h3">{name}</h4>
          <div className="typography-body-lg text-neu-800">{description}</div>
          <div className="typography-body-lg text-neu-800">{address}</div>
        </article>

        {gettingThere && (
          <div className="lg:flex-1">
            <h4 className="typography-h3 mb-6">Getting There</h4>
            <Accordion className="lg:min-h-[327px]" items={gettingThere} />
          </div>
        )}
      </div>
      {mapsEmbed && (
        <iframe
          src={mapsEmbed}
          width="100%"
          height="450"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="mt-4 select-none"
        />
      )}
    </section>
  )
}
