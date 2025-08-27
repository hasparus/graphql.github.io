import {
  TestimonialsList,
  type Testimonial,
} from "@/app/conf/2025/components/testimonials"
import { SectionLabel } from "@/app/conf/_design-system/section-label"

import mateoCollina from "./mateo-collina.webp"

const testimonials: Testimonial[] = [
  {
    quote:
      "GraphQL gives us enterprise performance with start-up agility: streamlined queries, lean payloads, live updates, and lightning-fast responses help our customers focus on building their applications, not building around them.",
    author: {
      name: "Matteo Collina",
      role: "Platformatic, Co-Founder & CTO",
      avatar: mateoCollina.src,
    },
  },
  {
    quote:
      "GraphQL is evolving to new use cases every day and it's really a competitive advantage to experience them first hand with everyone that matters.",
    author: {
      name: "Vincent Desmares",
      role: "Teamstarter, CTO",
      avatar:
        "https://avatars.sched.co/d/cc/21066875/avatar.jpg.320x320px.jpg?f80",
    },
  },
  {
    quote:
      "GraphQL is evolving to new use cases every day and it's really a competitive advantage to experience them first hand with everyone that matters.",
    author: {
      name: "Vincent Desmares",
      role: "Teamstarter, CTO",
      avatar:
        "https://avatars.sched.co/d/cc/21066875/avatar.jpg.320x320px.jpg?f80",
    },
  },
  {
    quote:
      "GraphQL is evolving to new use cases every day and it's really a competitive advantage to experience them first hand with everyone that matters.",
    author: {
      name: "Vincent Desmares",
      role: "Teamstarter, CTO",
      avatar:
        "https://avatars.sched.co/d/cc/21066875/avatar.jpg.320x320px.jpg?f80",
    },
  },
  {
    quote:
      "GraphQL is evolving to new use cases every day and it's really a competitive advantage to experience them first hand with everyone that matters.",
    author: {
      name: "Vincent Desmares",
      role: "Teamstarter, CTO",
      avatar:
        "https://avatars.sched.co/d/cc/21066875/avatar.jpg.320x320px.jpg?f80",
    },
  },
]

export function QuotesFromTheIndustry() {
  return (
    <div className="gql-container py-8 max-md:px-4 md:pb-16 md:pt-24 md:[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <div className="gql-section !py-0">
        <SectionLabel className="max-sm:-ml-1 max-sm:justify-center">
          Quotes from the industry
        </SectionLabel>
        <h2 className="typography-h2 mt-6 text-balance max-sm:text-center">
          Loved by world‑class devs
        </h2>
      </div>
      <TestimonialsList
        testimonials={testimonials}
        className="gql-focus-visible focus-visible:!-outline-offset-4 lg:!mt-0 lg:*:px-16"
      />
    </div>
  )
}
