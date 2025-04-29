import Stellate from "public/img/conf/Sponsors/Stellate.svg?svgr"
import Hasura from "public/img/conf/Sponsors/Hasura.svg?svgr"
import TheGuild from "public/img/conf/Sponsors/TheGuild.svg?svgr"
import Apollo from "public/img/conf/Sponsors/Apollo.svg?svgr"
import Tyk from "public/img/conf/Sponsors/Tyk.svg?svgr"
import IBM from "public/img/conf/Sponsors/IBM.svg?svgr"
import Graphweaver from "public/img/conf/Sponsors/Graphweaver.svg?svgr"

import { clsx } from "clsx"
import { ChevronRight } from "../pixelarticons/chevron-right"

interface Sponsor {
  icon: React.FC<React.SVGProps<SVGElement>>
  name: string
  link: string
}

const sponsorDiamond: Sponsor[] = [
  { icon: TheGuild, name: "The Guild", link: "https://the-guild.dev" },
  { icon: IBM, name: "IBM", link: "https://www.ibm.com/products/api-connect" },
]

const sponsorGold: Sponsor[] = [
  { icon: Apollo, name: "Apollo", link: "https://www.apollographql.com/" },
  { icon: Graphweaver, name: "Graphweaver", link: "https://graphweaver.com" },
  { icon: Hasura, name: "Hasura", link: "https://hasura.io" },
]

const sponsorSilver: Sponsor[] = [
  { icon: Stellate, name: "Stellate", link: "https://stellate.co" },
  { icon: Tyk, name: "Tyk", link: "https://tyk.io/" },
]

export interface SponsorsProps {
  heading?: string
}

interface Tier {
  name: string
  items: Sponsor[]
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
      <h3 className="flex min-w-[60px] items-center gap-1 whitespace-nowrap font-mono text-sm/none font-normal uppercase text-primary">
        <ChevronRight className="translate-y-[-0.5px]" />
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
            className="group flex h-24 w-72 items-center justify-center opacity-75 [--fill:hsl(var(--color-neu-700))] hover:bg-neu-500/10 hover:[--fill:hsl(var(--color-neu-800))] dark:opacity-90"
          >
            <Icon className="h-16 w-auto max-w-[80%] shrink-0 fill-[--fill] [&_path]:fill-[--fill]" />
          </a>
        ))}
      </div>
    </div>
  )
}
