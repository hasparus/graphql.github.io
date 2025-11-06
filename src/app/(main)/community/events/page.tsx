// ---
// title: Events & Meetups
// ---

// # Events & Meetups

"use client"

import type { ComponentType, ReactNode, SVGProps } from "react"
import type { Event } from "../../../../components/events"

import { events, EventCard } from "../../../../components/events"
import { Breadcrumbs } from "../../../../_design-system/breadcrumbs"
import { meetups } from "../../../../components/meetups"
import Link from "next/link"
import UsersIcon from "@/app/conf/_design-system/pixelarticons/users.svg?svgr"
import CommentIcon from "@/app/conf/_design-system/pixelarticons/comment.svg?svgr"
import SlidersIcon from "@/app/conf/_design-system/pixelarticons/sliders.svg?svgr"
import EyeIcon from "@/app/conf/_design-system/pixelarticons/eye.svg?svgr"
import { useEffect, useRef } from "react"
import "leaflet/dist/leaflet.css"
import pinkCircle from "../../../../pages/community/pink-circle.svg"

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

export function EventsScrollview({ children }: { children: ReactNode }) {
  return (
    <div className="xs:nextra-scrollbar relative -mx-6 flex gap-2 overflow-auto p-6 scrollview-fade-x-16 scrollview-fade sm:-mx-1 sm:px-1 lg:gap-4">
      {children}
    </div>
  )
}

export function Events({ events }: { events: Event[] }) {
  if (events.length === 0) return null

  return (
    <EventsScrollview>
      {events.map(event => (
        <EventCard
          key={event.slug}
          href={event.eventLink}
          date={new Date(event.date)}
          meta={event.host}
          name={event.name}
          city={event.location}
        />
      ))}
    </EventsScrollview>
  )
}

function BenefitCard({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: ComponentType<SVGProps<SVGElement>>
}) {
  return (
    <article className="flex h-full flex-col gap-6 border border-neu-200 bg-neu-0 p-6 text-left dark:border-neu-100">
      <Icon aria-hidden className="size-10 text-sec-darker" />
      <div className="flex flex-col gap-3 text-neu-900">
        <h3 className="text-[20px] font-normal leading-tight">{title}</h3>
        <p className="typography-body-md text-neu-700">{description}</p>
      </div>
    </article>
  )
}

function MeetupsMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Load only on client
    import("leaflet").then(L => {
      // Fixes GET http://localhost:3000/community/upcoming-events/marker-icon-2x.png 404 (Not Found)
      // and replace default marker image
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: pinkCircle.src,
        shadowUrl: "",
      })

      const map = L.map(mapRef.current!).setView([45, -15], 2)
      mapInstanceRef.current = map

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)

      for (const { node } of meetups) {
        L.marker([node.latitude, node.longitude])
          .addTo(map)
          .bindPopup(
            `<a href="${node.link}" target="_blank" rel="noreferrer" class="!text-primary">${node.name}</a>`,
          )
      }
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return <div ref={mapRef} className="z-0 my-6 h-96" />
}

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

      <section className="gql-section">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="typography-h2 text-balance">
            Benefits of getting involved
          </h2>
          <p className="typography-body-lg mt-4 text-balance text-neu-700">
            Contributing to GraphQL means more than writing code — it’s a chance
            to collaborate, share ideas, and shape the future of the ecosystem.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-16 xl:grid-cols-4">
          <BenefitCard
            icon={UsersIcon}
            title="Valuable networking opportunities"
            description="Engage in conversations and hands-on projects to deepen your understanding of GraphQL."
          />
          <BenefitCard
            icon={CommentIcon}
            title="Collaborate with others"
            description="Connect with contributors and teams building GraphQL tools and platforms."
          />
          <BenefitCard
            icon={SlidersIcon}
            title="Help guide the spec"
            description="Share ideas, give feedback, or participate in working groups to influence the future of GraphQL."
          />
          <BenefitCard
            icon={EyeIcon}
            title="Connect in real life"
            description="Put a face to the nickname — meet contributors in person at events and meetups. Build lasting connections beyond the screen."
          />
        </div>
      </section>

      {upcomingEvents.length > 0 && (
        <section className="gql-section">
          <h2 className="typography-h2">Upcoming Events</h2>
          <Events events={upcomingEvents} />
        </section>
      )}

      <section className="gql-section">
        <h2 className="typography-h2">Past Events</h2>
        <Events events={pastEvents} />
      </section>

      <section className="gql-section">
        <h2 className="typography-h2">Meetups</h2>
        <p className="typography-body-md">
          If you are interested in hosting a GraphQL meetup, The GraphQL
          Foundation is happy to promote your GraphQL event through the{" "}
          <Link href="/community/#official-channels">
            official communication channels
          </Link>
          .
        </p>

        <p className="typography-body-md">
          Please contact us in the <code>#meetups-admin</code> channel on{" "}
          <Link href="/community/#official-channels">
            the community Discord channel
          </Link>
          .
        </p>

        <div className="mt-6 flex items-center justify-center">
          <Link
            href="/community/foundation/local-initiative"
            className="inline-flex items-center justify-center bg-primary px-6 py-3 font-semibold text-white no-underline hover:bg-primary/90"
          >
            Start a GraphQL Local!
          </Link>
        </div>

        <MeetupsMap />

        <EventsScrollview>
          {meetups.map(({ node }) => (
            <EventCard
              key={node.id}
              href={node.link}
              name={node.name}
              city={node.city + ", " + node.country}
              official={node.official}
              date={node.next || node.prev}
            />
          ))}
        </EventsScrollview>
      </section>

      <section className="gql-section">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="typography-h2 text-balance">
            Benefits of getting involved
          </h2>
          <p className="typography-body-lg mt-4 text-balance text-neu-700">
            Contributing to GraphQL means more than writing code — it's a chance
            to collaborate, share ideas, and shape the future of the ecosystem.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <BenefitCard
            icon={UsersIcon}
            title="Valuable networking opportunities"
            description="Engage in conversations and hands-on projects to deepen your understanding of GraphQL."
          />
          <BenefitCard
            icon={CommentIcon}
            title="Collaborate with others"
            description="Connect with contributors and teams building GraphQL tools and platforms."
          />
          <BenefitCard
            icon={SlidersIcon}
            title="Help guide the spec"
            description="Share ideas, give feedback, or participate in working groups to influence the future of GraphQL."
          />
          <BenefitCard
            icon={EyeIcon}
            title="Connect in real life"
            description="Put a face to the nickname — meet contributors in person at events and meetups. Build lasting connections beyond the screen."
          />
        </div>
      </section>
    </div>
  )
}
