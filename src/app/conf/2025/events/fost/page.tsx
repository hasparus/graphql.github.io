import { Metadata } from "next"

import { Button } from "@/app/conf/_design-system/button"
import { Accordion } from "@/app/conf/_design-system/accordion"

import { Hero, HeroStripes } from "../../components/hero"
import { NavbarPlaceholder } from "../../components/navbar"
import { CalendarIcon } from "../../../_design-system/pixelarticons/calendar-icon"
import { PinIcon } from "../../../_design-system/pixelarticons/pin-icon"
import { CtaCardSection } from "../../components/cta-card-section"

import heroPhoto from "./hero-photo.webp"
import { Anchor } from "../../../_design-system/anchor"
import { HeroImageProper } from "./hero-image-proper"

export const metadata: Metadata = {
  title: "GraphQL Day at FOST",
}

const CFP_LINK =
  "https://apidaysglobal.typeform.com/speak?typeform-source=www.apidays.global"
const TICKETS_LINK =
  "https://ticket.apidays.global/event/apidays-paris-2025/3cccd07f-acb2-466e-8d91-cb1f208ecf42"

export default function GraphQLDayAtFostPage() {
  return (
    <>
      <NavbarPlaceholder className="top-0 bg-neu-100 before:bg-white/30 dark:bg-[#181A12] dark:before:bg-blk/40" />
      <Hero
        pageName="GraphQL Day at FOST"
        subtitle="Future Of Software Technology"
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
          <>
            <link
              rel="preload"
              as="image"
              href={heroPhoto.src}
              fetchPriority="high"
            />
            <div className="relative z-[2] h-[560px] w-full max-w-screen-3xl">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAAAQAgCdASoQAAgAAgA0JaQAD4hQ1bRHv9agAPw6PbleVhieTGWViJa7p/xj1kZN5VmPYZVd5JMgbm4C0P9r5kfkE8X/4/+ZENqggLde+OX4K4liSlOou0oAAAA=)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                }}
              />
              <div className="absolute inset-0 backdrop-blur-lg" />
              <HeroImageProper />
            </div>
          </>
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
          <ExpertMeetupSection />
          <VenueAndLocationSection />
          <EventPartnersSection />
        </div>
        <CtaCardSection
          title="Stay in the know"
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
    <section className="gql-section flex gap-6 bg-neu-100 max-md:flex-col xl:py-12">
      <h3 className="typography-h2 md:flex-[.5]">About</h3>
      <div className="flex flex-col gap-6 md:flex-1">
        <p className="typography-body-lg">
          Join us for a special GraphQL Day as part of the Future of Software
          Week, co‑located with API Days Paris. This focused event brings
          together GraphQL practitioners, innovators, and thought leaders for a
          day of deep technical discussions and hands-on learning.
        </p>
        <p className="typography-body-lg text-pretty">
          Whether you're already using GraphQL in production or just getting
          started, this is your opportunity to connect with the community, share
          best practices, and discover the latest developments in the GraphQL
          ecosystem.
        </p>
      </div>
    </section>
  )
}

function ExpertMeetupSection() {
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
          description="Connect with the European GraphQL community. Build relationships that extend beyond the conference."
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
      <p className="typography-body-md text-neu-700 dark:text-neu-300">
        {description}
      </p>
    </article>
  )
}

function VenueAndLocationSection() {
  return (
    <section className="gql-section xl:py-12">
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
              Centre des nouvelles industries et technologies
              <br />
              2 Pl. de la Défense
              <br />
              92800 Puteaux, France
            </address>
          </div>
        </article>

        <div className="lg:flex-1">
          <h4 className="typography-h3 mb-6">Getting There</h4>
          <Accordion
            className="lg:min-h-[327px]"
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
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57929.22297036571!2d2.1992477079806285!3d48.896253935132876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66502128aae1f%3A0xe5e22af4aa16ed38!2sWestfield%20CNIT!5e0!3m2!1sen!2spl!4v1756923974711!5m2!1sen!2spl"
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

function EventPartnersSection() {
  return (
    <section className="gql-section">
      <h3 className="typography-h2 mb-12 text-center">Event Partners</h3>
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-12 max-md:flex-col md:gap-16">
            <div className="flex items-center justify-center">
              <Anchor
                href="https://www.apidays.global/events/paris"
                className="p-8 hover:bg-neu-100"
              >
                <img
                  src="https://cdn.prod.website-files.com/67a0938d08d1902cd6974340/68112b11f6895235885793a7_Apidays%20logo%20v2.png"
                  alt="API Days"
                  className="h-24 w-auto object-contain invert dark:invert-0"
                />
              </Anchor>
            </div>
          </div>
        </div>

        <p className="typography-body-lg mx-auto max-w-2xl text-pretty text-center">
          GraphQL Day is organized by API&nbsp;Days as part of the Future of
          Software Technology.
          {/* todo: link to some FOST page? */}
        </p>
      </div>
    </section>
  )
}
