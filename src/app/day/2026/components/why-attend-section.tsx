export function WhyAttendSection() {
  return (
    <section className="gql-section xl:py-12">
      <h3 className="typography-h2 mb-12">Why attend GraphQL Day?</h3>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card
          title="Technical Deep Dives"
          description="Learn advanced patterns, performance optimization techniques, and architectural decisions from teams running GraphQL at scale."
        />
        <Card
          title="Best Practices Exchange"
          description="Share your learnings and challenges with fellow practitioners. Discover how others solve common GraphQL problems."
        />
        <Card
          title="Innovation Showcase"
          description="Explore cutting-edge tools, upcoming features, and experimental approaches that are shaping GraphQL's future."
        />
        <Card
          title="Community Building"
          description="Connect with the GraphQL community. Build relationships that extend beyond the conference."
        />
        <Card
          title="Hands-on Learning"
          description="Interactive sessions where you can experiment with new tools and techniques in real-time."
        />
        <Card
          title="Q&A Sessions"
          description="Direct access to library maintainers and core contributors. Get your specific questions answered."
        />
      </div>
    </section>
  )
}

function Card({ title, description }: { title: string; description: string }) {
  return (
    <article className="flex flex-col gap-4 border border-neu-200 p-6">
      <h4 className="typography-h3">{title}</h4>
      <p className="typography-body-md text-neu-700">{description}</p>
    </article>
  )
}
