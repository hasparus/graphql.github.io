import clsx from "clsx"
import Image from "next-image-export-optimizer"
import type { StaticImageData } from "next/image"

import TwitterXIcon from "@/icons/twitter.svg?svgr"
import LinkedInIcon from "@/icons/linkedin.svg?svgr"
import { eventsColors } from "../utils"

import { Anchor } from "../../_design-system/anchor"
import { Tag } from "../../_design-system/tag"
import { SchedSpeaker } from "../../2023/types"
import {
  SocialMediaIcon,
  SocialMediaIconServiceType,
} from "../../_components/speakers/social-media"

export interface SpeakerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl?: string | StaticImageData
  tags?: string[]
  isReturning?: boolean
  stripes?: string
  speaker: SchedSpeaker
  year: string
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
      <div className="absolute inset-0 bg-gradient-to-b from-sec-dark/50 to-sec-light/50" />
    </div>
  )
}

export function SpeakerCard({
  imageUrl,
  tags = [],
  className,
  speaker,
  year,
  ...props
}: SpeakerCardProps) {
  return (
    <article
      className={clsx(
        "relative flex flex-col overflow-hidden border border-neu-300",
        className,
      )}
      {...props}
    >
      <div className="flex gap-6 p-6">
        {imageUrl && (
          <div className="relative aspect-square size-[236px] shrink-0 overflow-hidden">
            <div className="absolute inset-0 z-[1] bg-sec-light opacity-90 mix-blend-multiply" />
            <Image
              src={imageUrl}
              alt=""
              width={312}
              height={312}
              className="size-full object-cover saturate-[0.1] transition-transform"
            />
            <Stripes
              // TODO!
              mask={""}
            />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-1">
            <h3 className="typography-body-lg">{speaker.name}</h3>
            <p className="text-neu-700 typography-body-sm">
              {[speaker.position, speaker.company].filter(Boolean).join(", ")}
            </p>
          </div>
          {speaker.about && (
            <p className="text-neu-700 typography-body-sm">{speaker.about}</p>
          )}
          {/* TODO: We'll have to collect it when fetching all sessions. */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Tag color={eventsColors[tag] || "hsl(var(--color-sec-base))"}>
                  {tag}
                </Tag>
              ))}
            </div>
          )}
          <div className="flex gap-4">
            {speaker.socialurls?.length ? (
              <div className="mt-0 text-[#765e5e]">
                <div className="flex space-x-2">
                  {speaker.socialurls.map(social => (
                    <a
                      key={social.url}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center text-blk"
                    >
                      <SocialMediaIcon
                        service={
                          social.service.toLowerCase() as SocialMediaIconServiceType
                        }
                      />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Anchor
        href={`/conf/${year}/speakers/${speaker.username}`}
        className="absolute inset-0"
        title={`See ${speaker.name.split(" ")[0]}'s sessions`}
      />
    </article>
  )
}
