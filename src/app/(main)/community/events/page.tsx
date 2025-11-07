"use client"

import type { Event } from "./events"

import { events } from "./events"
import { Breadcrumbs } from "../../../../_design-system/breadcrumbs"

import UsersIcon from "@/app/conf/_design-system/pixelarticons/users.svg?svgr"
import CommentIcon from "@/app/conf/_design-system/pixelarticons/comment.svg?svgr"
import SlidersIcon from "@/app/conf/_design-system/pixelarticons/sliders.svg?svgr"
import EyeIcon from "@/app/conf/_design-system/pixelarticons/eye.svg?svgr"

import Mailbox from "./mailbox.svg?svgr"
import { Meetups } from "./meetups"
import { BenefitCard } from "./benefit-card"
import { EventsList } from "./events-list"
import { Button } from "../../../conf/_design-system/button"

const { pastEvents, upcomingEvents } = events.reduce(
  (acc, event) => {
    const now = new Date()
    const date = new Date(event.date)
    if (date < now) {
      acc.pastEvents.push(event)
    } else {
      acc.upcomingEvents.push(event)
    }
    return acc
  },
  { pastEvents: [], upcomingEvents: [] } as {
    pastEvents: Event[]
    upcomingEvents: Event[]
  },
)

export default function EventsPage() {
  return (
    <div className="gql-container">
      <h1 className="hidden">Events & Meetups</h1>

      <div className="gql-section">
        <Breadcrumbs
          activePath={[
            {
              name: "Community",
              title: "Community",
              route: "/community",
              type: "page",
              children: [],
              frontMatter: {},
            },
            {
              name: "Events & Meetups",
              title: "Events & Meetups",
              route: "/community/events",
              type: "page",
              children: [],
              frontMatter: {},
            },
          ]}
        />
      </div>

      {upcomingEvents.length > 0 && (
        <section className="gql-section">
          <h2 className="typography-h2">Upcoming events</h2>
          <p className="typography-body-md mt-6">
            See what’s coming up across the GraphQL ecosystem.
          </p>
          <EventsList events={upcomingEvents} />
        </section>
      )}

      <section className="gql-section">
        <h2 className="typography-h2">Past events</h2>
        <p className="typography-body-md mt-6">
          A look back at how the GraphQL community connects and grows together.
        </p>
        <EventsList events={pastEvents} />
      </section>

      <section className="gql-section">
        <h2 className="typography-h2">Meetups</h2>
        <p className="typography-body-md mt-6">
          If you are interested in hosting a GraphQL meetup, The GraphQL
          Foundation is happy to promote your GraphQL event through the official
          communication channels. .
        </p>

        <Meetups />
      </section>

      <BenefitsSection />
      <GetYourMeetupNoticedSection />
    </div>
  )
}

function BenefitsSection() {
  return (
    <section className="gql-section">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="typography-h2 text-balance">
          Benefits of getting involved
        </h2>
        <p className="typography-body-lg mt-4 text-balance text-neu-800 lg:mt-6">
          Contributing to GraphQL means more than writing code — it’s a chance
          to collaborate, share ideas, and shape the future of the ecosystem.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-16 xl:grid-cols-4">
        <BenefitCard
          icon={<UsersIcon aria-hidden className="size-10 text-sec-darker" />}
          title="Valuable networking opportunities"
          description="Engage in conversations and hands-on projects to deepen your understanding of GraphQL."
        />
        <BenefitCard
          icon={<CommentIcon aria-hidden className="size-10 text-sec-darker" />}
          title="Collaborate with others"
          description="Connect with contributors and teams building GraphQL tools and platforms."
        />
        <BenefitCard
          icon={<SlidersIcon aria-hidden className="size-10 text-sec-darker" />}
          title="Help guide the spec"
          description="Share ideas, give feedback, or participate in working groups to influence the future of GraphQL."
        />
        <BenefitCard
          icon={<EyeIcon aria-hidden className="size-10 text-sec-darker" />}
          title="Connect in real life"
          description="Put a face to the handle — meet contributors in person at events and meetups. Build lasting connections beyond the screen."
        />
      </div>
    </section>
  )
}

function GetYourMeetupNoticedSection() {
  const serverLink = "https://discord.graphql.org"
  const channelLink =
    "https://discord.com/channels/625400653321076807/1020000211927576766/"

  return (
    <section className="gql-section">
      <div className="flex flex-col gap-10 border border-sec-dark bg-sec-lighter px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:gap-16 lg:px-16">
        <div>
          <p className="typography-h2 text-balance text-neu-900">
            Get your meetup noticed
          </p>
          <div className="mt-6 space-y-4 text-neu-800">
            <p className="typography-body-lg text-balance">
              Planning to host a GraphQL meetup? The GraphQL Foundation can help
              spread the word through official channels.
            </p>
            <p className="typography-body-lg text-balance">
              To submit your event, join our{" "}
              <a
                href={serverLink}
                target="_blank"
                rel="noreferrer"
                className="typography-link"
              >
                Discord
              </a>{" "}
              and share details in the{" "}
              <a
                href={channelLink}
                target="_blank"
                rel="noreferrer"
                className="typography-link"
              >
                #locals
              </a>{" "}
              channel.
            </p>
          </div>
          <Button href={channelLink} className="mt-8 w-fit">
            Go to Discord
          </Button>
        </div>
        <div className="flex aspect-square h-full shrink-0 justify-center">
          <div className="flex aspect-square w-full max-w-[320px] items-center justify-center border border-sec-dark bg-sec-light p-6 text-sec-darker sm:p-8">
            <Mailbox aria-hidden className="size-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
