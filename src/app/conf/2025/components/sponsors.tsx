import Stellate from "public/img/conf/Sponsors/Stellate.svg"
import Postman from "public/img/conf/Sponsors/Postman.svg"
import Solo from "public/img/conf/Sponsors/Solo.svg"
import Hasura from "public/img/conf/Sponsors/Hasura.svg"
import TheGraph from "public/img/conf/Sponsors/TheGraph.svg"
import TheGuild from "public/img/conf/Sponsors/TheGuild.svg"
import Hygraph from "public/img/conf/Sponsors/Hygraph.svg"
import StepZen from "public/img/conf/Sponsors/StepZen.svg"
import Inigo from "public/img/conf/Sponsors/Inigo.svg"
import Neo4j from "public/img/conf/Sponsors/Neo4j.svg"
import WunderGraph from "public/img/conf/Sponsors/WunderGraph.svg"
import Graphabase from "public/img/conf/Sponsors/Graphabase.svg"
import GraphQLWeekly from "public/img/conf/Partners/GraphQLWeekly.svg"
import GraphQLWTF from "public/img/conf/Partners/GraphQLwtf.svg"
import EscapeTechnologies from "public/img/conf/Partners/EscapeTechnologies.svg"
import AmsterdamGraphQL from "public/img/conf/Partners/AmsterdamGraphQL.svg"
import BangkokGraphQL from "public/img/conf/Partners/BangkokGraphQL.svg"
import TypeGraphQL from "public/img/conf/Partners/TypeGraphQL.svg"
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
  icon: string
  name: string
  link: string
}

const sponsorDiamond: Image[] = [
  { icon: Hasura, name: "Hasura", link: "https://hasura.io" },
  { icon: Postman, name: "Postman", link: "https://postman.com" },
  { icon: TheGuild, name: "The Guild", link: "https://the-guild.dev" },
]

const sponsorPlatinum: Image[] = [
  { icon: Hygraph, name: "Hygraph", link: "https://hygraph.com" },
  { icon: Solo, name: "Solo.io", link: "https://solo.io" },
]

const sponsorGold: Image[] = [
  { icon: StepZen, name: "StepZen", link: "https://stepzen.com" },
  { icon: Inigo, name: "Inigo", link: "https://inigo.io" },
  { icon: TheGraph, name: "The Graph", link: "https://thegraph.com" },
]

const sponsorSilver: Image[] = [
  { icon: Graphabase, name: "Graphabase", link: "https://graphabase.com" },
  { icon: Neo4j, name: "Neo4j", link: "https://neo4j.com" },
  { icon: Stellate, name: "Stellate", link: "https://stellate.co" },
  { icon: WunderGraph, name: "WunderGraph", link: "https://wundergraph.com" },
]

const workshopDaySponsors: Image[] = [
  { icon: TheGuild, name: "The Guild", link: "https://the-guild.dev" },
]

const mediaPartners: Image[] = [
  { icon: GraphQLWTF, name: "GraphQLWTF", link: "https://graphql.wtf" },
  {
    icon: GraphQLWeekly,
    name: "GraphQLWeekly",
    link: "https://graphqlweekly.com",
  },
]

const communityPartners: Image[] = [
  {
    icon: AmsterdamGraphQL,
    name: "Amsterdam GraphQL",
    link: "https://meetup.com/amsterdam-graphql-meetup",
  },
  {
    icon: BangkokGraphQL,
    name: "Bangkok GraphQL",
    link: "https://meetup.com/graphql-bangkok",
  },
  {
    icon: EscapeTechnologies,
    name: "EscapeTechnologies",
    link: "https://escape.tech",
  },
  { icon: TypeGraphQL, name: "TypeGraphQL", link: "https://typegraphql.com" },
]

function List({
  items,
  className,
  linkClassName,
}: {
  items: Image[]
  className?: string
  linkClassName?: string
}) {
  return (
    <div className={clsx("flex flex-row flex-wrap gap-x-8 gap-y-4", className)}>
      {items.map(({ link, icon, name }, i) => (
        <a
          key={i}
          href={link}
          target="_blank"
          rel="noreferrer"
          title={name}
          className={clsx(
            "flex h-24 w-72 items-center justify-center",
            linkClassName,
          )}
        >
          <NextImage
            alt={`${name} logo`}
            src={icon}
            className="max-h-16 w-auto max-w-[80%] shrink-0 object-contain text-neu-600"
          />
        </a>
      ))}
    </div>
  )
}

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
    name: "Platinum",
    items: sponsorPlatinum,
  },
  {
    name: "Gold",
    items: sponsorGold,
  },
  {
    name: "Silver",
    items: sponsorSilver,
  },
  {
    name: "Workshop Day Sponsor",
    items: workshopDaySponsors,
  },
]

const partnerTiers: Tier[] = [
  {
    name: "Media Partners",
    items: mediaPartners,
  },
  {
    name: "Community Partners",
    items: communityPartners,
  },
]
// --- End Data structure ---

export function Sponsors({ heading }: SponsorsProps) {
  return (
    <section className="gql-conf-section py-16">
      <h1 className="typography-h2">{heading}</h1>

      <div className="mt-10 md:mt-16">
        {sponsorTiers.map(tier => (
          <Tier key={tier.name} tier={tier} />
        ))}
      </div>

      <div className="flex flex-col self-stretch border-t border-[#E7E9E2] pt-16">
        <h1 className="mb-4 text-5xl font-normal text-[#0E0F0B]">Partners</h1>
        {partnerTiers.map(tier => (
          <Tier key={tier.name} tier={tier} />
        ))}
      </div>
    </section>
  )
}

function Tier({ tier }: { tier: Tier }) {
  return (
    <div className="flex gap-x-12 gap-y-4 border-t border-neu-200 py-4 dark:border-neu-50 max-md:flex-col">
      <h3 className="min-w-[180px] whitespace-nowrap font-mono text-sm font-normal uppercase text-primary">
        <TierIcon />
        {tier.name}
      </h3>
      <List items={tier.items} />
    </div>
  )
}
