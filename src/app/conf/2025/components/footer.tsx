import NextLink from "next/link"
import { ReactNode } from "react"
import { clsx } from "clsx"
import { SocialIcons } from "../../_components/social-icons"

export function Footer({
  links,
  logo,
}: {
  links: { href: string; children: string; "aria-disabled"?: true }[][]
  logo: ReactNode
}) {
  return (
    <footer className="gql-conf-section gql-all-anchors-focusable !bg-neu-100 py-10 text-neu-900 typography-menu dark:!bg-neu-0 max-md:px-0 max-md:pt-0 lg:py-20">
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
      <div className="flex justify-between gap-10 text-sm max-lg:flex-col max-md:px-5">
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
