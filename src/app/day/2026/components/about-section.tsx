import { ReactNode } from "react"

export function AboutSection({ children }: { children?: ReactNode }) {
  return (
    <div className="bg-neu-100">
      <section className="gql-section gql-container flex gap-6 max-md:flex-col xl:py-12">
        <h3 className="typography-h2 md:flex-[.5]">About</h3>
        <div className="flex flex-col gap-6 text-neu-800 md:flex-1">
          {children || (
            <>
              <p className="typography-body-lg">
                GraphQL Day is a one-day event organized by the community for
                the community, hosted at FOST.
              </p>
              <p className="typography-body-lg">
                This focused event brings together GraphQL practitioners,
                innovators, and thought leaders for a day of deep technical
                discussions and hands-on learning.
              </p>
              <p className="typography-body-lg text-pretty">
                Whether you're already using GraphQL in production or just
                getting started, this is your opportunity to connect with the
                community, share best practices, and discover the latest
                developments in the GraphQL ecosystem.
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
