import Image from "next/image"
import clsx from "clsx"

import { Marquee } from "@/app/conf/_design-system/marquee"
import { StripesDecoration } from "@/app/conf/_design-system/stripes-decoration"
import { Anchor } from "@/app/conf/_design-system/anchor"
import { getBase64Placeholder } from "@/app/conf/_design-system/utils/get-base64-placeholder"

import styles from "./speaker-card.module.css"

interface PastSpeaker {
  name: string
  role: string
  avatar?: string
  link: string
}

const PAST_SPEAKERS: PastSpeaker[] = [
  {
    name: "Benjie Gillam",
    role: "GraphQL TSC, GraphQL Foundation",
    avatar: "https://avatars.sched.co/b/99/18743846/avatar.jpg.320x320px.jpg",
    link: "https://www.linkedin.com/in/benjiegillam/",
  },
  {
    name: "Michael Staib",
    role: "Co-Founder, ChilliCream",
    avatar: "https://avatars.sched.co/9/36/21490456/avatar.jpg.320x320px.jpg",
    link: "https://www.linkedin.com/in/michael-staib-31519571/",
  },
  {
    name: "Ivan Goncharov",
    role: "Head of R&D, Keenethics",
    avatar: "https://avatars.sched.co/1/fe/14899949/avatar.jpg.320x320px.jpg",
    link: "https://www.linkedin.com/in/igoncharov/",
  },
  {
    name: "Martin Bonnin",
    role: "Android Engineer, Apollo GraphQL",
    avatar: "https://avatars.sched.co/f/e1/14899982/avatar.jpg.320x320px.jpg",
    link: "https://www.linkedin.com/in/martinbonnin/",
  },
  {
    name: "Benjamin Coenen",
    role: "Sr Staff Engineer, Apollo GraphQL",
    avatar: "https://avatars.sched.co/d/47/21510680/avatar.jpg.320x320px.jpg",
    link: "https://www.linkedin.com/in/coenenbenjamin/",
  },
  {
    name: "Aurélien David",
    role: "Co-founder & CTO, Pennylane",
    avatar: "https://avatars.sched.co/8/59/21490530/avatar.jpg.320x320px.jpg",
    link: "https://www.linkedin.com/in/aurel-spyl/",
  },
  {
    name: "An Ngo",
    role: "Lead Engineer, bol",
    link: "https://www.linkedin.com/in/vliegveld5/",
  },
  {
    name: "Jens Neuse",
    role: "CEO, WunderGraph",
    avatar: "https://avatars.sched.co/a/e2/18744043/avatar.jpg.320x320px.jpg",
    link: "https://www.linkedin.com/in/jens-neuse-706673195/",
  },
  {
    name: "Pascal Senn",
    role: "COO, ChilliCream",
    avatar: "https://avatars.sched.co/7/44/21490463/avatar.jpg.320x320px.jpg",
    link: "https://www.linkedin.com/in/pascal-senn-90899a15a",
  },
  {
    name: "Matthias Le Brun",
    role: "Frontend Developer & Designer",
    link: "https://www.linkedin.com/in/bloodyowl/",
  },
  {
    name: "Vanessa Johnson",
    role: "Android Engineer, The New York Times",
    link: "https://www.linkedin.com/in/vanessa-johnson999/",
  },
  {
    name: "Jonathan Rainer",
    role: "Staff Engineer, Apollo GraphQL",
    link: "https://www.linkedin.com/in/jonathan-rainer/",
  },
]

const ROW_1 = PAST_SPEAKERS.slice(0, 6)
const ROW_2 = PAST_SPEAKERS.slice(6)

export async function PastSpeakersSection() {
  return (
    <section className="gql-section xl:py-12">
      <h3 className="typography-h2 mb-2">Past Speakers</h3>
      <p className="typography-body-md mb-8 text-neu-700">
        GraphQL Day Paris 2025
      </p>
      <div className="flex flex-col gap-4 overflow-hidden">
        <Marquee speed={30} speedOnHover={15} gap={0}>
          {await Promise.all(
            ROW_1.map(s => <PastSpeakerCard key={s.name} {...s} />),
          )}
        </Marquee>
        <Marquee speed={25} speedOnHover={12} gap={0} reverse>
          {await Promise.all(
            ROW_2.map(s => <PastSpeakerCard key={s.name} {...s} />),
          )}
        </Marquee>
      </div>
    </section>
  )
}

async function PastSpeakerCard({ name, role, avatar, link }: PastSpeaker) {
  let placeholder: string | undefined
  if (avatar) {
    try {
      placeholder = await getBase64Placeholder(avatar)
    } catch {
      // ok in dev
    }
  }

  return (
    <article
      className={clsx(
        "group relative w-[300px] shrink-0 overflow-hidden border border-r-0 border-neu-200 bg-neu-0 @container dark:border-neu-100",
        styles.speakerCard,
      )}
    >
      <div className="flex h-full flex-col gap-4 p-4 @[420px]:flex-row md:gap-6 md:p-6">
        {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
        <div className="Avatar relative aspect-square overflow-hidden @[420px]:w-[120px] @[420px]:shrink-0">
          <div className="absolute inset-0 z-[1] bg-sec-light mix-blend-multiply" />
          {avatar ? (
            <Image
              src={avatar}
              placeholder={placeholder! as `data:image/${string}`}
              alt=""
              width={120}
              height={120}
              className="size-full object-cover saturate-[.1]"
            />
          ) : (
            <div
              className="size-full"
              style={{
                backgroundImage:
                  "linear-gradient(163deg, #759236 0%, hsl(var(--color-sec-lighter)) 100%)",
              }}
            />
          )}
          <Stripes />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <h4 className="typography-body-lg">{name}</h4>
          <p className="typography-body-sm line-clamp-2 text-neu-800">{role}</p>
        </div>
      </div>
      <Anchor
        href={link}
        className="absolute inset-0 z-[1] ring-inset ring-neu-400 transition-[background-color,box-shadow] duration-150 ease-out hover:bg-sec-base/[.035] hover:ring-1 dark:ring-neu-100 dark:hover:bg-sec-base/[.05]"
        aria-label={`${name} on LinkedIn`}
      />
    </article>
  )
}

function Stripes() {
  return (
    <div
      role="presentation"
      className={clsx(
        "pointer-events-none absolute inset-0 inset-y-[-20px]",
        styles.stripes,
      )}
    >
      <StripesDecoration oddClassName="absolute inset-0 bg-gradient-to-b from-sec-dark to-[var(--end-color)]" />
    </div>
  )
}
