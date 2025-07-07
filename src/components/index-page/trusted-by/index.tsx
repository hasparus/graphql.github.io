import { clsx } from "clsx"

import { Button } from "@/app/conf/_design-system/button"

import MetaLockup from "./logos/Meta.svg?svgr"
import IBMWordmark from "./logos/IBM.svg?svgr"
import AirBnBLockup from "./logos/AirBnB.svg?svgr"
import IntuitWordmark from "./logos/Intuit.svg?svgr"
import AWSLogo from "./logos/AWS.svg?svgr"
import PayPalWordmark from "./logos/PayPal.svg?svgr"
import NewYorkTimesWordmark from "./logos/NewYorkTimes.svg?svgr"
import StarbucksWordmark from "./logos/Starbucks.svg?svgr"
import ShopifyLockup from "./logos/Shopify.svg?svgr"
import GitHubLockup from "./logos/GitHub.svg?svgr"

import styles from "./style.module.css"

const logos: LogoListItem[] = [
  {
    href: "https://meta.com",
    alt: "Meta",
    component: MetaLockup,
  },
  {
    href: "https://aws.amazon.com",
    alt: "AWS",
    component: props => (
      <AWSLogo {...props} className={clsx(props.className, "w-[110px]")} />
    ),
  },

  // todo: Netflix?
  // {
  //   href: "https://netflix.com",
  //   alt: "Netflix",
  //   component: NetflixWordmark,
  // },
  {
    href: "https://airbnb.com",
    alt: "Airbnb",
    component: AirBnBLockup,
  },
  {
    href: "https://intuit.com",
    alt: "Intuit",
    component: IntuitWordmark,
  },

  {
    href: "https://ibm.com",
    alt: "IBM",
    component: props => (
      <IBMWordmark {...props} className={clsx(props.className, "w-[140px]")} />
    ),
  },

  {
    href: "https://paypal.com",
    alt: "PayPal",
    component: PayPalWordmark,
  },
  {
    href: "https://nytimes.com",
    alt: "New York Times",
    component: NewYorkTimesWordmark,
  },
  {
    href: "https://starbucks.com",
    alt: "Starbucks",
    component: props => (
      <StarbucksWordmark
        {...props}
        className={clsx(props.className, "w-[200px] -translate-x-1.5")}
      />
    ),
  },
  {
    href: "https://shopify.com",
    alt: "Shopify",
    component: ShopifyLockup,
  },
  {
    href: "https://github.com",
    alt: "GitHub",
    component: GitHubLockup,
  },
]

export function TrustedBy() {
  return (
    <section className="gql-section gql-container bg-neu-0 py-8 lg:py-16 xl:py-24">
      <div className="flex flex-wrap justify-between gap-6">
        <h2 className="typography-h3 max-w-[474px] text-neu-800">
          GraphQL is open source and trusted by the industry
        </h2>
        <p className="typography-body-md max-w-[624px] text-neu-700">
          Facebook's mobile apps have been powered by GraphQL since 2012. A
          GraphQL spec was open-sourced in 2015. Now it is used by
          industry-leading companies worldwide and supported by the GraphQL
          Foundation, hosted since 2018 by the non-profit Linux Foundation.
        </p>
      </div>
      <div
        className={clsx(
          "mt-6 flex flex-wrap justify-center bg-neu-400 md:my-12 xl:my-16 xl:grid xl:grid-cols-5 xl:gap-px",
          styles.logos,
        )}
      >
        {logos.map(({ alt, href, component: Component }) => (
          <a
            key={alt}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center justify-center bg-neu-0 p-4 hover:bg-neu-100 md:p-6 lg:p-8 xl:p-10"
          >
            <Component />
          </a>
        ))}
      </div>

      <Button href="/users" className="mx-auto w-fit">
        More GraphQL users
      </Button>
    </section>
  )
}

interface LogoListItem {
  href: string
  alt: string
  component: React.FC<{ className?: string }>
}
