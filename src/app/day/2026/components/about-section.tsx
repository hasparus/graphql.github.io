import { ReactNode } from "react"

export function AboutSection({ children }: { children?: ReactNode }) {
  return (
    <div className="bg-neu-100 dark:bg-neu-0/50">
      <section className="gql-section gql-container flex gap-6 max-md:flex-col xl:py-12">
        <h3 className="typography-h2 md:flex-[.5]">About</h3>
        <div className="flex flex-col gap-6 text-neu-800 md:flex-1">
          {children || (
            <>
              <p className="typography-body-lg">
                GraphQL Day is a one-day community event hosted at FOST (Future
                of Software Technologies). Expect real-world talks, workshops,
                and conversations about building with GraphQL.
              </p>
              <p className="typography-body-lg text-pretty">
                The event is open to everyone — whether you run GraphQL in
                production or are evaluating it for your next project.
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
