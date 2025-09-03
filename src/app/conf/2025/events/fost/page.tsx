import { Metadata } from "next"

import { Button } from "@/app/conf/_design-system/button"

import { Hero, HeroStripes } from "../../components/hero"
import { NavbarPlaceholder } from "../../components/navbar"
import { CalendarIcon } from "../../../_design-system/pixelarticons/calendar-icon"
import { PinIcon } from "../../../_design-system/pixelarticons/pin-icon"

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
            className="-scale-x-100 dark:data-[loaded=true]:opacity-80"
            evenClassName="bg-[linear-gradient(180deg,hsl(var(--color-sec-light))_0%,hsl(319deg_100%_90%_/_0.2)_100%)] dark:bg-[linear-gradient(180deg,hsl(var(--color-sec-dark))_0%,hsl(var(--color-neu-100))_100%)]"
            oddClassName="bg-[linear-gradient(180deg,hsl(319deg_100%_90%_/_0.2)_0%,hsl(var(--color-sec-base))_100%)] dark:bg-[linear-gradient(180deg,hsl(var(--color-sec-dark))_0%,hsl(var(--color-neu-0))_100%)]"
          />
        }
        rightContent={null}
      >
        <HeroDateAndLocation />
        <div className="flex items-center gap-4 max-md:flex-col">
          <Button href={CFP_LINK} className="md:w-fit">
            Submit a proposal
          </Button>
          <Button className="md:w-fit" href={TICKETS_LINK} variant="secondary">
            Get your tickets
          </Button>
        </div>
      </Hero>
      <main className="gql-all-anchors-focusable gql-conf-navbar-strip text-neu-900 before:bg-white/40 before:dark:bg-blk/30"></main>
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
