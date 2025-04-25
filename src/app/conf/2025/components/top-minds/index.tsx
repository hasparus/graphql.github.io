import clsx from "clsx"
import { HTMLAttributes } from "react"
import Image from "next-image-export-optimizer"
import type { StaticImageData } from "next/image"

import elizabethStone from "./speakers/elizabeth-stone.webp"
import kamilKisiela from "./speakers/kamil-kisiela.webp"
import rajeevRajan from "./speakers/rajeev-rajan.webp"
import tenmaiGopal from "./speakers/tenmai-gopal.webp"
import uriGoldshtein from "./speakers/uri-goldshtein.webp"
import TwitterIcon from "@/icons/twitter.svg"
import { Button } from "@/app/conf/_design-system/button"

interface TopMindsSectionProps extends HTMLAttributes<HTMLElement> {}

export default function TopMindsSection({
  className,
  ...rest
}: TopMindsSectionProps) {
  return (
    <section
      className={clsx(
        "px-4 py-8 text-neu-900 max-md:flex-col lg:px-12 xl:gap-x-24 xl:px-24",
        className,
      )}
      {...rest}
    >
      <div className="flex flex-wrap max-sm:flex-col">
        {/* todo: look up socials */}
        <h3 className="grow pb-6 pr-6 typography-h2">
          Meet the top industry minds
        </h3>
        <SpeakerCard
          name="Uri Goldshtein"
          title="The Guild — Founder"
          src={uriGoldshtein}
        />
        <SpeakerCard
          name="Elizabeth Stone"
          title="Netflix — CTO"
          src={elizabethStone}
          linkedinHref="https://www.linkedin.com/in/elizabeth-stone-608a754/"
        />
        <div className="flex grow max-sm:contents">
          <SpeakerCard
            name="Kamil Kisiela"
            title="The Guild — Developer"
            src={kamilKisiela}
          />
          <SpeakerCard
            name="Rajeev Rajan"
            title="Atlassian — CTO"
            src={rajeevRajan}
          />
          <SpeakerCard
            name="Tenmai Gopal"
            title="Hasura — CEO & Co-Founder"
            src={tenmaiGopal}
          />
          <div className="mt-6 flex grow items-end justify-end pl-6">
            <Button variant="secondary">View all speakers</Button>
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
  twitterHref,
  linkedinHref,
  className,
}: {
  name: string
  title: string
  src: string | StaticImageData
  twitterHref?: string
  linkedinHref?: string
  className?: string
}) {
  return (
    <article
      className={clsx(
        ":border-r border-y border-r border-sec-dark first-of-type:border-l",
        className,
      )}
    >
      <Image
        src={src}
        alt=""
        width={236}
        height={236}
        className="aspect-square size-[236px] w-full object-cover transition-transform"
      />
      <div className="flex items-stretch border-t border-sec-dark">
        <div className="flex grow flex-col gap-1 p-3">
          <h4 className="typography-body-md">{name}</h4>
          <p className="text-neu-700 typography-body-xs">{title}</p>
        </div>
        {(linkedinHref || twitterHref) && (
          <div className="flex items-center border-l border-sec-dark sm:flex-col sm:border-l">
            {linkedinHref && (
              <a
                href={linkedinHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex grow items-center justify-center p-4 transition-colors hover:text-neu-700 dark:hover:text-neu-400 sm:p-2"
              >
                <LinkedInIcon />
              </a>
            )}
            {twitterHref && (
              <a
                href={twitterHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex grow items-center justify-center p-4 transition-colors hover:text-neu-700 dark:hover:text-neu-400 sm:p-2"
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
