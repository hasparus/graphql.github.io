import clsx from "clsx"
import { HTMLAttributes } from "react"
import Image from "next-image-export-optimizer"
import type { StaticImageData } from "next/image"

import TwitterIcon from "@/icons/twitter.svg"
import { Button } from "@/app/conf/_design-system/button"
import { BECOME_A_SPEAKER_LINK } from "../../links"
import { StripesDecoration } from "@/app/conf/_design-system/stripes-decoration"

const previousConfSpeakers = {
  benjie: {
    name: "Benjie Gillam",
    title: "GraphQL TSC & Spec",
    src: "https://avatars.sched.co/b/99/18743846/avatar.jpg.320x320px.jpg",
    twitter: "benjie",
    linkedin: "benjiegillam",
  },
  kewei: {
    name: "Kewei Qu",
    title: "Meta, Senior Staff Engineer",
    src: "https://avatars.sched.co/9/1a/18743864/avatar.jpg.320x320px.jpg",
    twitter: "kewei_qu",
    linkedin: "keweiqu",
  },
  donna: {
    name: "Donna Zhou",
    title: "Atlassian, GraphQL Java",
    src: "https://avatars.sched.co/0/1d/18743879/avatar.jpg.320x320px.jpg?e1f",
    linkedin: "donnazhou",
  },
  uri: {
    name: "Uri Goldshtein",
    title: "The Guild, Founder",
    src: "https://avatars.sched.co/8/2b/14900013/avatar.jpg.320x320px.jpg?9f1",
    twitter: "UriGoldshtein",
    linkedin: "urigo",
  },
  alessia: {
    name: "Alessia Bellisario",
    title: "Apollo, Staff Engineer",
    src: "https://avatars.sched.co/a/c6/18743837/avatar.jpg.320x320px.jpg?847",
    twitter: "alessbell",
    linkedin: "alessiabellisario",
  },
}

interface TopMindsSectionProps extends HTMLAttributes<HTMLElement> {
  hasSpeakersPage?: boolean
}

export default function TopMindsSection({
  className,
  hasSpeakersPage,
  ...rest
}: TopMindsSectionProps) {
  return (
    <section
      className={clsx(
        "gql-conf-section flex justify-center max-md:flex-col [@media(767px<width<807px)]:px-6 [@media(807px<=width<858px)]:px-12",
        className,
      )}
      {...rest}
    >
      <div className="flex grid-cols-2 flex-wrap [@media(444px<width<743px)]:grid [@media(width<=444px)]:flex-col [@media(width<=743px)]:justify-center [@media(width>=970px)]:*:border-b-0">
        <h3 className="mr-auto flex w-full grow text-pretty pb-6 pr-6 typography-h2 [@media(width>857px)]:basis-0">
          Meet the top industry minds
        </h3>
        <SpeakerCard
          {...previousConfSpeakers.benjie}
          stripes="linear-gradient(80deg, hsl(var(--color-pri-base)) 0%, hsl(var(--color-pri-base)) 5%, transparent 40%, transparent)"
        />
        <SpeakerCard
          {...previousConfSpeakers.kewei}
          className="[@media(width<=742px)]:border-l"
          stripes="radial-gradient(circle at bottom right, hsl(var(--color-pri-base)) 0%, hsl(var(--color-pri-base)) 10%, transparent 40%, transparent)"
        />
        <div className="flex grow border-sec-dark [@media(width<970px)]:contents [@media(width>=970px)]:border-t [@media(width>=970px)]:*:border-t-0">
          <SpeakerCard
            {...previousConfSpeakers.donna}
            className="[@media(744px<=width<=970px)]:first-of-type:border-l-0"
            stripes="radial-gradient(ellipse at top left, hsl(var(--color-pri-base)) 0%, hsl(var(--color-pri-base)) 5%, transparent 40%, transparent, transparent 85%, black 100%)"
          />
          <SpeakerCard
            {...previousConfSpeakers.uri}
            className="[@media(639px<=width<=970px)]:border-l"
            stripes="linear-gradient(-40deg, hsl(var(--color-pri-base)) 0%, hsl(var(--color-pri-base)) 5%, transparent 40%, transparent)"
          />
          <SpeakerCard
            {...previousConfSpeakers.alessia}
            className="[@media(width<744px)]:border-l"
            stripes="radial-gradient(circle at top left, transparent 0%, transparent 65%, black 90%)"
          />
          <div className="mt-6 flex shrink-0 basis-[content] items-end justify-stretch max-lg:w-full [@media(640px<=width<=855px)]:basis-[236px] [@media(width<=444px)]:*:w-full [@media(width>742px)]:justify-end [@media(width>742px)]:pl-6 [@media(width>855px)]:grow">
            {hasSpeakersPage ? (
              <Button variant="secondary" href="/conf/2025/speakers/">
                View all speakers
              </Button>
            ) : (
              <Button variant="secondary" href={BECOME_A_SPEAKER_LINK}>
                Become a speaker
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function SpeakerCard({
  name,
  title,
  src,
  twitter,
  linkedin,
  className,
  stripes,
}: {
  name: string
  title: string
  src: string | StaticImageData
  twitter?: string
  linkedin?: string
  className?: string
  stripes?: string
}) {
  return (
    <article
      className={clsx(
        "flex shrink-0 flex-col border-y border-r border-sec-dark first-of-type:border-l max-sm:border-l",
        className,
      )}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-[1] bg-sec-light opacity-90 mix-blend-multiply" />
        <Image
          src={src}
          alt=""
          width={312}
          height={312}
          className="aspect-square size-[312px] w-full object-cover saturate-[0.1] transition-transform sm:h-[236px]"
        />
        <Stripes mask={stripes} />
      </div>
      <div className="flex flex-1 items-stretch border-t border-sec-dark">
        <div className="flex grow flex-col justify-center gap-1 p-3 sm:h-[80px]">
          <h4 className="typography-body-md">{name}</h4>
          <p className="text-neu-700 typography-body-xs">{title}</p>
        </div>
        {(linkedin || twitter) && (
          <div className="flex border-l border-sec-dark max-sm:divide-x sm:flex-col sm:items-center sm:divide-y sm:border-l">
            {linkedin && (
              <a
                href={`https://www.linkedin.com/in/${linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex grow items-center justify-center p-4 transition-colors hover:bg-neu-900/10 hover:text-neu-700 sm:p-2"
              >
                <LinkedInIcon />
              </a>
            )}
            {twitter && (
              <a
                href={`https://x.com/${twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex grow items-center justify-center border-sec-dark p-4 transition-colors hover:bg-neu-900/10 hover:text-neu-700 sm:p-2"
              >
                <TwitterIcon className="size-6" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

function LinkedInIcon(props: HTMLAttributes<SVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M19 3C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19ZM18.5 18.5V13.2C18.5 12.3354 18.1565 11.5062 17.5452 10.8948C16.9338 10.2835 16.1046 9.94 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17C14.6813 12.17 15.0374 12.3175 15.2999 12.5801C15.5625 12.8426 15.71 13.1987 15.71 13.57V18.5H18.5ZM6.88 8.56C7.32556 8.56 7.75288 8.383 8.06794 8.06794C8.383 7.75288 8.56 7.32556 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19C6.43178 5.19 6.00193 5.36805 5.68499 5.68499C5.36805 6.00193 5.19 6.43178 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56ZM8.27 18.5V10.13H5.5V18.5H8.27Z" />
    </svg>
  )
}

function Stripes({ mask }: { mask?: string }) {
  return (
    <div
      role="presentation"
      className="pointer-events-none absolute inset-0 inset-y-[-20px]"
      style={{
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      <StripesDecoration evenClassName="bg-gradient-to-b from-sec-darker to-sec-dark" />
    </div>
  )
}
