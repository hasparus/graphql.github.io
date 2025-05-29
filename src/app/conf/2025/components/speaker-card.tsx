import clsx from "clsx"
import Image from "next-image-export-optimizer"

import { eventsColors } from "../utils"

import { Anchor } from "../../_design-system/anchor"
import { Tag } from "../../_design-system/tag"
import { SchedSpeaker } from "../../2023/types"
import { StripesDecoration } from "../../_design-system/stripes-decoration"
import { SocialIcon, SocialIconType } from "../../_design-system/social-icon"

export interface SpeakerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tags?: string[]
  isReturning?: boolean
  stripes?: string
  speaker: SchedSpeaker
  year: string
}

export function SpeakerCard({
  tags = [],
  className,
  speaker,
  year,
  ...props
}: SpeakerCardProps) {
  return (
    <article
      className={clsx(
        "relative flex flex-col overflow-hidden border border-neu-300 [container-type:inline-size]",
        className,
      )}
      {...props}
    >
      <div className="flex gap-6 p-6">
        <SpeakerLinks speaker={speaker} className="absolute right-6 top-6" />
        {speaker.avatar && (
          <div className="relative aspect-square shrink-0 overflow-hidden">
            <div className="absolute inset-0 z-[1] bg-sec-light mix-blend-multiply" />
            <Image
              src={speaker.avatar}
              alt=""
              width={176}
              height={176}
              className="size-full object-cover saturate-[.1] transition-transform"
            />
            <Stripes mask="radial-gradient(ellipse at top left, hsl(var(--color-pri-base)) 0%, hsl(var(--color-pri-base)) 5%, transparent 40%, transparent, transparent 85%, black 100%)" />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-1">
            <h3 className="typography-body-lg">{speaker.name}</h3>
            <p className="typography-body-sm text-neu-800">
              {[speaker.position, speaker.company].filter(Boolean).join(", ")}
            </p>
          </div>
          {speaker.about && (
            <p className="typography-body-sm text-neu-800">{speaker.about}</p>
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
        </div>
      </div>
      <Anchor
        href={`/conf/${year}/speakers/${speaker.username}`}
        className="absolute inset-0 z-[1] ring-inset ring-neu-400 hover:ring-1 dark:ring-neu-100"
        title={`See ${speaker.name.split(" ")[0]}'s sessions`}
      />
    </article>
  )
}

function SpeakerLinks({
  speaker,
  className,
}: {
  speaker: SchedSpeaker
  className?: string
}) {
  const speakerUrls = SocialIconType.all
    .map(social => speaker.socialurls.find(x => x.service === social))
    .concat([{ service: "website", url: speaker.url || "" }])
    .filter((x): x is Exclude<typeof x, undefined> => !!x?.url)
    .slice(-3)

  return (
    <div
      className={clsx(
        "z-[3] flex divide-x divide-neu-200 border border-neu-200",
        className,
      )}
    >
      {speakerUrls.map(social => (
        <a
          key={social.url}
          href={social.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center p-2 text-neu-900"
        >
          <SocialIcon type={social.service.toLowerCase()} className="size-5" />
        </a>
      ))}
    </div>
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
      <StripesDecoration oddClassName="absolute inset-0 bg-gradient-to-b from-sec-dark to-sec-light" />
    </div>
  )
}
