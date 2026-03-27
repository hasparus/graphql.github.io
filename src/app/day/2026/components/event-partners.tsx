import { Anchor } from "@/app/conf/_design-system/anchor"

export function EventPartnersSection() {
  return (
    <section className="gql-section">
      <h3 className="typography-h2 mb-12 text-center">Event Partners</h3>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-center">
          <Anchor
            href="https://www.joinfost.io"
            className="p-8 hover:bg-neu-100"
          >
            {/* TODO: replace with FOST logo SVG when available */}
            <span className="text-4xl font-bold tracking-tight">FOST</span>
          </Anchor>
        </div>
        <p className="typography-body-lg mx-auto max-w-2xl text-pretty text-center">
          GraphQL Day is organized by the community for the community and hosted
          at FOST (Future of Software Technologies).
        </p>
      </div>
    </section>
  )
}
