import { Button } from "@/app/conf/_design-system/button"

export function BecomeASpeakerSection({
  cfpLink,
  cfpDeadline,
}: {
  cfpLink?: string
  cfpDeadline?: string
}) {
  return (
    <section className="gql-section xl:py-12">
      <h3 className="typography-h2 mb-8">Become a speaker</h3>
      <div className="flex max-w-2xl flex-col gap-6">
        <p className="typography-body-lg">
          Any GraphQL topic is welcome: feedback from the trenches,
          introductions, technical deep-dives, workshops, lightning talks and
          more!
        </p>
        <p className="typography-body-lg">
          The FOST audience includes non-GraphQL experts from other communities
          (AsyncAPI, OpenAPI, JSON Schema, ...) as well as CTOs and business
          decision-makers. Submissions that address this diverse audience are
          especially appreciated.
        </p>
        <p className="typography-body-lg">
          All speakers will get a free conference ticket.
        </p>
        {cfpDeadline && (
          <p className="typography-body-lg">The CFP closes on {cfpDeadline}.</p>
        )}
        {cfpLink ? (
          <Button href={cfpLink} className="whitespace-nowrap md:w-fit">
            Submit a talk
          </Button>
        ) : (
          <Button disabled className="whitespace-nowrap opacity-55 md:w-fit">
            CFP coming soon
          </Button>
        )}
      </div>
    </section>
  )
}
