import { Metadata } from "next"
import Image from "next-image-export-optimizer"

import { Button } from "@/app/conf/_design-system/button"
import { Accordion } from "@/app/conf/_design-system/accordion"

import { Hero, HeroStripes } from "../../components/hero"
import { NavbarPlaceholder } from "../../components/navbar"
import { CalendarIcon } from "../../../_design-system/pixelarticons/calendar-icon"
import { PinIcon } from "../../../_design-system/pixelarticons/pin-icon"
import { CtaCardSection } from "../../components/cta-card-section"

import heroPhoto from "./hero-photo.webp"

export const metadata: Metadata = {
  title: "GraphQL Day at FOST",
}

const CFP_LINK =
  "https://docs.google.com/forms/d/1ElXceLzWftBvcEwrqYZSt8TqfVbrSFohtfmSFONolSk/preview"
const TICKETS_LINK =
  "https://ticket.apidays.global/event/apidays-paris-2025/3cccd07f-acb2-466e-8d91-cb1f208ecf42"

const API_DAYS_COLOR = "#02B3B6"

export default function ResourcesPage() {
  return (
    <>
      <NavbarPlaceholder className="top-0 bg-neu-100 before:bg-white/30 dark:bg-[#181A12] dark:before:bg-blk/40" />
      <Hero
        pageName="GraphQL Day at FOST"
        subtitle="Future Of Software Week"
        colorScheme="neutral"
        stripes={
          <HeroStripes
            className="-scale-x-100 [--color-sec-base:181deg_97.8%_36.1%] [--color-sec-dark:181deg_98.3%_23.1%] [--color-sec-light:181deg_74.3%_80.2%] dark:data-[loaded=true]:opacity-80"
            evenClassName="bg-[linear-gradient(180deg,hsl(var(--color-sec-light))_0%,hsl(319deg_100%_90%_/_0.2)_100%)] dark:bg-[linear-gradient(180deg,hsl(var(--color-sec-dark))_0%,hsl(var(--color-neu-100))_100%)]"
            oddClassName="bg-[linear-gradient(180deg,hsl(319deg_100%_90%_/_0.2)_0%,hsl(var(--color-sec-base))_100%)] dark:bg-[linear-gradient(180deg,hsl(var(--color-sec-dark))_0%,hsl(var(--color-neu-0))_100%)]"
          />
        }
        rightContent={null}
        bottom={
          <div className="z-[2]">
            <Image
              src={heroPhoto}
              width={1920}
              height={560}
              alt="five speakers at GraphQLConf 2024"
              className="mx-auto h-[560px] w-[1920px] max-w-full object-cover"
            />
          </div>
        }
      >
        <HeroDateAndLocation />
        <div className="flex items-center gap-4 max-md:flex-col">
          <Button href={CFP_LINK} className="md:w-fit">
            Submit a proposal
          </Button>
          <Button
            className="backdrop-blur-xl md:w-fit"
            href={TICKETS_LINK}
            variant="secondary"
          >
            Get your tickets
          </Button>
        </div>
      </Hero>
      <main className="gql-all-anchors-focusable gql-conf-navbar-strip text-neu-900 before:bg-white/40 before:dark:bg-blk/30">
        <div className="gql-container">
          <AboutEventSection />
          <WhatToExpectSection />
          <ExpertMeetupSection />
          <VenueAndLocationSection />
        </div>
        <CtaCardSection
          title="Join the community"
          description="Meet the experts, share best practices, and discover the latest innovations shaping the future of APIs."
        >
          <div className="flex gap-4 max-sm:flex-col sm:items-center">
            <Button href={CFP_LINK} variant="primary">
              Submit a proposal
            </Button>
            <Button href={TICKETS_LINK} variant="secondary">
              Get your tickets
            </Button>
          </div>
        </CtaCardSection>
      </main>
    </>
  )
}

function HeroDateAndLocation() {
  return (
    <div className="typography-body-md flex flex-col gap-4 md:flex-row md:gap-6">
      <div className="flex items-center gap-2">
        <CalendarIcon className="size-5 sm:size-6" />
        <time dateTime="2025-09-08">December 11</time>
      </div>
      <div className="flex items-center gap-2">
        <PinIcon className="size-5 sm:size-6" />
        <address className="not-italic">CNIT La Defense, Paris</address>
      </div>
    </div>
  )
}

function AboutEventSection() {
  return (
    <section className="gql-section flex gap-6 max-md:flex-col">
      <h3 className="typography-h2 md:flex-1">About GraphQL Day</h3>
      <div className="flex flex-col gap-6 md:flex-1">
        <p className="typography-body-lg">
          Join us for a special GraphQL Day as part of the Future of Software
          Week, co-located with API Days Paris. This focused event brings
          together GraphQL practitioners, innovators, and thought leaders for a
          day of deep technical discussions and hands-on learning.
        </p>
        <p className="typography-body-lg">
          Whether you're already using GraphQL in production or just getting
          started, this is your opportunity to connect with the community, share
          best practices, and discover the latest developments in the GraphQL
          ecosystem.
        </p>
      </div>
    </section>
  )
}

function WhatToExpectSection() {
  return (
    <section className="gql-section flex gap-6 max-md:flex-col">
      <h3 className="typography-h2 md:flex-1">What to expect</h3>
      <ul className="flex flex-col gap-6 uppercase md:flex-1">
        <ListItem number="8+" text="Expert talks" />
        <ListItem number="12+" text="Speakers" />
        <ListItem number="3" text="Lightning talks" />
        <ListItem number="2" text="Panel discussions" />
        <ListItem number="300+" text="Attendees" />
      </ul>
    </section>
  )
}

function ListItem({ number, text }: { number: string | number; text: string }) {
  return (
    <li className="list-none bg-gradient-to-r from-[#CDF27E] p-6 dark:from-[#507501]">
      <span className="inline-block text-[72px]/none [text-box:trim-both_cap_alphabetic]">
        {number}
      </span>{" "}
      <span className="typography-menu mb-2 inline-block">{text}</span>
    </li>
  )
}

function ExpertMeetupSection() {
  return (
    <section className="gql-section">
      <h3 className="typography-h2 mb-12">
        Meet the experts, share your experience
      </h3>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <ExpertCard
          title="Technical Deep Dives"
          description="Learn advanced patterns, performance optimization techniques, and architectural decisions from teams running GraphQL at scale."
        />
        <ExpertCard
          title="Best Practices Exchange"
          description="Share your learnings and challenges with fellow practitioners. Discover how others solve common GraphQL problems."
        />
        <ExpertCard
          title="Innovation Showcase"
          description="Explore cutting-edge tools, upcoming features, and experimental approaches that are shaping GraphQL's future."
        />
        <ExpertCard
          title="Community Building"
          description="Connect with the European GraphQL community. Build relationships that extend beyond the conference."
        />
        <ExpertCard
          title="Hands-on Learning"
          description="Interactive sessions where you can experiment with new tools and techniques in real-time."
        />
        <ExpertCard
          title="Q&A Sessions"
          description="Direct access to library maintainers and core contributors. Get your specific questions answered."
        />
      </div>
    </section>
  )
}

function ExpertCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <article className="flex flex-col gap-4 border border-neu-200 p-6 dark:border-neu-700">
      <h4 className="typography-h3">{title}</h4>
      <p className="typography-body-md text-neu-700 dark:text-neu-300">
        {description}
      </p>
    </article>
  )
}

function VenueAndLocationSection() {
  return (
    <section className="gql-section">
      <h3 className="typography-h2 mb-12">Venue & Location</h3>
      <div className="flex gap-x-12 gap-y-10 max-lg:flex-col">
        <article className="flex flex-col gap-6 lg:flex-1">
          <h4 className="typography-h3">
            Centre of New Industries and Technologies
          </h4>
          <p className="typography-body-lg">
            Located in Puteaux, commune in the western suburbs of Paris, CNIT is
            an iconic venue offering state-of-the-art facilities and easy access
            to public transportation, making it perfect for technology
            conferences.
          </p>
          <div className="typography-body-lg">
            <address className="not-italic">
              Centre des nouvelles industries et technologies (CNIT)
              <br />
              2 Pl. de la Défense
              <br />
              92800 Puteaux, France
            </address>
          </div>
          <Button href="https://maps.app.goo.gl/example" className="w-fit">
            View on Google Maps
          </Button>
        </article>

        <div className="lg:flex-1">
          <h4 className="typography-h3 mb-6">Getting There</h4>
          <Accordion
            items={[
              {
                title: "By Metro/RER",
                description: (
                  <>
                    Take RER A or Metro Line 1 to "La Défense" station.
                    <br />
                    The venue is directly accessible from the station.
                  </>
                ),
              },
              {
                title: "From Airports",
                description: (
                  <>
                    <strong>Charles de Gaulle:</strong> Take RER B to
                    Châtelet-Les Halles, then RER A to La Défense (45 minutes
                    total).
                    <br />
                    <strong>Orly:</strong> Take Orlyval to Antony, then RER B to
                    Châtelet, then RER A to La Défense (60 minutes total).
                  </>
                ),
              },
              {
                title: "Parking",
                description: (
                  <>
                    Multiple parking facilities available in La Défense.
                    <br />
                    We recommend using public transportation when possible.
                    <br />
                    Early booking recommended for parking spaces.
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1311.5979270428409!2d2.2390248!3d48.8926045!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66502128aae1f%3A0xe5e22af4aa16ed38!2sWestfield%20CNIT!5e0!3m2!1sen!2spl!4v1756917405738!5m2!1sen!2spl"
        width="100%"
        height="450"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="mt-4"
      />
    </section>
  )
}
