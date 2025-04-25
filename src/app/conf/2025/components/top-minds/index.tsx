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

interface TopMindsSectionProps extends HTMLAttributes<HTMLElement> {}

export default function TopMindsSection({
  className,
  ...rest
}: TopMindsSectionProps) {
  return (
    <section
      className={clsx(
        "flex gap-6 px-4 py-8 text-neu-900 max-md:flex-col lg:px-12 xl:gap-x-24 xl:px-24",
        className,
      )}
      {...rest}
    >
      <h3 className="typography-h2">Meet the top industry minds</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SpeakerCard
          name="Uri Goldshtein"
          title="The Guild — Founder"
          src={uriGoldshtein}
          twitterHref="UriGoldshtein"
          linkedinHref="uri-goldshtein-88986749"
        />
        <SpeakerCard
          name="Elizabeth Stone"
          title="Netflix — CTO"
          src={elizabethStone}
          linkedinHref="https://www.linkedin.com/in/elizabeth-stone-608a754/"
        />
        <SpeakerCard
          name="Kamil Kisiela"
          title="The Guild — Developer"
          src={kamilKisiela}
          twitterHref="kamilkisiela"
          linkedinHref="kamilkisiela"
        />
        <SpeakerCard
          name="Rajeev Rajan"
          title="Atlassian — CTO"
          src={rajeevRajan}
          twitterHref="rajeevrajango"
          linkedinHref="rajeev-rajan"
        />
        <SpeakerCard
          name="Tenmai Gopal"
          title="Hasura — CEO & Co-Founder"
          src={tenmaiGopal}
          twitterHref="tenmaigopal"
          linkedinHref="tenmai"
        />
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
}: {
  name: string
  title: string
  src: string | StaticImageData
  twitterHref?: string
  linkedinHref?: string
}) {
  return (
    <article className="group flex flex-col">
      <div className="relative aspect-square w-full overflow-hidden border border-[#83BD02]">
        <Image
          src={src}
          alt=""
          width={236}
          height={236}
          className="size-full object-cover transition-transform duration-300"
        />
      </div>
      <div className="flex items-center justify-between border border-t-0 border-[#83BD02] p-3">
        <div className="flex flex-col gap-1">
          <h4 className="font-medium typography-body-md">{name}</h4>
          <p className="text-neu-700 typography-body-sm">{title}</p>
        </div>
        <div className="flex gap-3">
          {twitterHref && (
            <a
              href={twitterHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neu-700 transition-colors hover:text-neu-900"
            >
              <TwitterIcon className="size-6" />
            </a>
          )}
          {linkedinHref && (
            <a
              href={linkedinHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neu-700 transition-colors hover:text-neu-900"
            >
              <LinkedInIcon />
            </a>
          )}
        </div>
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
