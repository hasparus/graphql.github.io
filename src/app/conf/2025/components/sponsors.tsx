import Stellate from "public/img/conf/Sponsors/Stellate.svg?svgr"
import Hasura from "public/img/conf/Sponsors/Hasura.svg?svgr"
import TheGuild from "public/img/conf/Sponsors/TheGuild.svg?svgr"
import Apollo from "public/img/conf/Sponsors/Apollo.svg?svgr"
import Tyk from "public/img/conf/Sponsors/Tyk.svg?svgr"
import IBM from "public/img/conf/Sponsors/IBM.svg?svgr"
import Graphweaver from "public/img/conf/Sponsors/Graphweaver.svg?svgr"

import NextImage from "next-image-export-optimizer"
import { clsx } from "clsx"

// Component for the small triangle icon before tier labels
function TierIcon() {
  return (
    <svg
      width="8"
      height="10"
      viewBox="0 0 8 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-1 inline-block h-auto w-2 fill-primary"
    >
      <path d="M7.5 5L6.11959e-07 10L0 0L7.5 5Z" />
    </svg>
  )
}

interface Image {
  icon: React.FC<React.SVGProps<SVGElement>>
  name: string
  link: string
}

const sponsorDiamond: Image[] = [
  { icon: TheGuild, name: "The Guild", link: "https://the-guild.dev" },
  { icon: IBM, name: "IBM", link: "https://www.ibm.com/products/api-connect" },
]

const sponsorGold: Image[] = [
  { icon: Apollo, name: "Apollo", link: "https://www.apollographql.com/" },
  { icon: Graphweaver, name: "Graphweaver", link: "https://graphweaver.com" },
  { icon: Hasura, name: "Hasura", link: "https://hasura.io" },
]

const sponsorSilver: Image[] = [
  { icon: Stellate, name: "Stellate", link: "https://stellate.co" },
  { icon: Tyk, name: "Tyk", link: "https://tyk.io/" },
]

export interface SponsorsProps {
  heading?: string
}

// --- Data structure for Tiers ---
interface Tier {
  name: string
  items: Image[]
}

const sponsorTiers: Tier[] = [
  {
    name: "Diamond",
    items: sponsorDiamond,
  },
  {
    name: "Gold",
    items: sponsorGold,
  },
  {
    name: "Silver",
    items: sponsorSilver,
  },
]

export function Sponsors({ heading }: SponsorsProps) {
  return (
    <section className="gql-conf-section mx-auto w-fit max-w-full py-16">
      <h1 className="typography-h2">{heading}</h1>

      <div className="mt-10 md:mt-16">
        {sponsorTiers.map(tier => (
          <Tier key={tier.name} tier={tier} />
        ))}
      </div>
    </section>
  )
}

function Tier({ tier }: { tier: Tier }) {
  return (
    <div className="flex gap-x-12 gap-y-4 border-t border-neu-200 py-4 dark:border-neu-50 max-md:flex-col">
      <h3 className="min-w-[60px] whitespace-nowrap font-mono text-sm font-normal uppercase text-primary">
        <TierIcon />
        {tier.name}
      </h3>
      <div
        className={clsx(
          "grid justify-center gap-x-8 gap-y-4 md:grid-cols-2 xl:grid-cols-3",
        )}
      >
        {tier.items.map(({ link, icon: Icon, name }, i) => (
          <a
            key={i}
            href={link}
            target="_blank"
            rel="noreferrer"
            title={name}
            className="group flex h-24 w-72 items-center justify-center rounded-lg opacity-70 [--fill:hsl(var(--color-neu-700))] hover:bg-neu-500/10 hover:[--fill:hsl(var(--color-neu-800))] dark:opacity-90"
          >
            <Icon className="h-16 w-auto max-w-[80%] shrink-0 fill-[--fill] [&_path]:fill-[--fill]" />
          </a>
        ))}
      </div>
    </div>
  )
}
