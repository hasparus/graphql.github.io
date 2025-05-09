import NextLink from "next/link"
import { ReactNode } from "react"
import { clsx } from "clsx"

import { SocialIcons } from "../../../_components/social-icons"

import blurBean from "./blur-bean.webp"

export function Footer({
  links,
  logo,
}: {
  links: { href: string; children: string; "aria-disabled"?: true }[][]
  logo: ReactNode
}) {
  return (
    <footer className="gql-conf-section gql-all-anchors-focusable relative !bg-neu-100 py-10 text-neu-900 typography-menu dark:!bg-neu-0 max-md:px-0 max-md:pt-0 lg:py-20">
      <Stripes />
      <div className="mb-10 flex flex-wrap items-start justify-between xl:mb-32 xl:gap-10">
        <div className="border-neu-400 p-5 max-md:w-full max-md:border-b md:p-4">
          {logo}
        </div>
        {links.map((link, i) => (
          <ul key={i} className="max-md:contents">
            {link.map(({ "aria-disabled": isDisabled, children, ...link }) => (
              <li key={link.href} className="mb-3.5 max-md:w-1/2">
                <NextLink
                  {...link}
                  className={clsx(
                    "gql-focus-visible block p-5",
                    isDisabled
                      ? "pointer-events-none"
                      : "underline-offset-4 hover:underline",
                  )}
                  tabIndex={isDisabled ? -1 : undefined}
                >
                  {children}
                </NextLink>
              </li>
            ))}
          </ul>
        ))}
      </div>
      <div className="relative flex justify-between gap-10 text-sm max-lg:flex-col max-md:px-5">
        <div className="flex flex-col font-light max-md:gap-5">
          <p>
            Copyright © {new Date().getFullYear()} The GraphQL Foundation. All
            rights reserved.
          </p>
          <p>
            For web site terms of use, trademark policy and general project
            policies please see{" "}
            <a
              href="https://lfprojects.org"
              target="_blank"
              rel="noreferrer"
              className="typography-link"
            >
              https://lfprojects.org
            </a>
            .
          </p>
        </div>
        <SocialIcons className="[&>a:focus]:text-current [&>a:focus]:ring-transparent [&>a:hover]:bg-neu-900/10 [&>a:hover]:text-current" />
      </div>
    </footer>
  )
}

const maskEven =
  "repeating-linear-gradient(to right, transparent, transparent 12px, black 12px, black 24px)"
const maskOdd =
  "repeating-linear-gradient(to right, black, black 12px, transparent 12px, transparent 24px)"

function Stripes() {
  return (
    <div
      role="presentation"
      // prettier-ignore
      // false positive
      // eslint-disable-next-line tailwindcss/no-contradicting-classname
      className="pointer-events-none absolute inset-0
        [--start-1:rgba(255,204,239,.05)]
        [--end-1:hsl(var(--color-pri-base)/.8)]
        dark:[--start-1:hsl(var(--color-pri-darker))]
        dark:[--end-1:hsl(var(--color-pri-base)/.9)]

        [--start-2:transparent]
        [--end-2:hsl(var(--color-pri-dark)/0.8)]
        dark:[--start-2:rgba(255,204,239,.1)]
        dark:[--end-2:hsl(var(--color-pri-base)/.8)]
      "
      style={{
        maskImage: `url(${blurBean.src})`,
        WebkitMaskImage: `url(${blurBean.src})`,
        maskPosition: "center 300px",
        WebkitMaskPosition: "center 300px",
        maskSize: "200% 110%",
        WebkitMaskSize: "200% 110%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskOrigin: "top",
      }}
    >
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,var(--start-1)_0%,var(--end-1)_200%)]"
        style={{
          maskImage: maskEven,
          WebkitMaskImage: maskEven,
        }}
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,var(--start-2)_0%,var(--end-2)_200%)]"
        style={{
          maskImage: maskOdd,
          WebkitMaskImage: maskOdd,
        }}
      />
    </div>
  )
}
