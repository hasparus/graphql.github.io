import NextLink from "next/link"
import { useConfig, useThemeConfig } from "nextra-theme-docs"

import { GraphQLWordmarkLogo } from "@/icons"
import { SocialIcons } from "@/app/conf/_components/social-icons"
import { StripesDecoration } from "@/app/conf/_design-system/stripes-decoration"
import blurBean from "@/app/conf/2025/components/footer/blur-bean.webp"

import { renderComponent } from "../utils"
import { Anchor } from "@/app/conf/_design-system/anchor"
import type { ReactNode } from "react"
import { ConferenceFooterBox } from "./conference-footer-box"

interface FooterLink {
  title: ReactNode
  route: string
}

interface FooterSection {
  title?: ReactNode
  route?: string
  links: FooterLink[]
}

const FOOTER_SECTIONS_COUNT = 4
const MAX_LINKS_PER_SECTION = 5
const CONFERENCE_YEAR = 2025

export function Footer({ extraLinks }: { extraLinks: FooterLink[] }) {
  const { sections, hasConferenceBox } = useFooterSections(extraLinks)
  const themeConfig = useThemeConfig()

  return (
    <footer className="relative !bg-neu-100 text-neu-900 dark:!bg-neu-0 max-md:px-0 max-md:pt-0">
      <Stripes />

      <div className="mx-auto max-w-[120rem] border-neu-400 dark:border-neu-100 3xl:border-x">
        <div className="flex flex-wrap justify-between gap-4 p-4 max-md:w-full md:p-6 2xl:px-10">
          <NextLink href="/" className="nextra-logo flex items-center">
            <GraphQLWordmarkLogo className="h-6" title="GraphQL" />
          </NextLink>
        </div>

        <div className="grid grid-cols-2 gap-px bg-neu-400 py-px dark:bg-neu-100 lg:grid-cols-5">
          {sections.map((section, i) => (
            <div
              className="typography-menu relative bg-neu-100 py-4 dark:bg-neu-0 lg:py-6 3xl:py-10"
              key={i}
            >
              {section.title && (
                <h3 className="font-bold lg:mb-4 3xl:mb-10">
                  {section.route ? (
                    <Anchor
                      className="gql-focus-visible block p-4 underline-offset-4 hover:underline md:px-6 2xl:px-10"
                      href={section.route}
                    >
                      {section.title}
                    </Anchor>
                  ) : (
                    <span className="block p-4 3xl:px-10">{section.title}</span>
                  )}
                </h3>
              )}
              {section.links.map(link => (
                <Anchor
                  key={link.route}
                  href={link.route}
                  className="gql-focus-visible block p-4 underline-offset-4 hover:underline md:px-6 2xl:px-10"
                >
                  {link.title}
                </Anchor>
              ))}
            </div>
          ))}
          <div className="flex flex-col max-lg:contents">
            {hasConferenceBox && (
              <ConferenceFooterBox
                href={`/conf/${CONFERENCE_YEAR}`}
                className="z-[2] col-span-full flex-1 max-lg:row-start-1"
              />
            )}
            <SocialIcons
              count={4}
              className="col-span-full gap-px text-pri-base *:flex *:flex-1 *:items-center *:justify-center *:bg-neu-100 *:dark:bg-neu-0 max-sm:*:aspect-square lg:*:aspect-square [&>a:focus]:text-current [&>a:focus]:ring-transparent [&>a:hover]:bg-neu-0/90 [&>a:hover]:text-current [&_svg]:!h-8"
            />
          </div>
        </div>

        <div className="relative flex items-center justify-between gap-4 p-4 md:px-6 2xl:px-10">
          {themeConfig.darkMode && (
            // todo: new theme switch component
            <div className="typography-menu flex items-center *:rounded-none dark:*:text-neu-900">
              {renderComponent(themeConfig.themeSwitch.component)}
            </div>
          )}
          <p className="typography-body-xs flex flex-col text-pretty max-md:gap-5">
            {renderComponent(themeConfig.footer.content)}
          </p>
        </div>
      </div>
    </footer>
  )
}

function Stripes() {
  return (
    <div
      role="presentation"
      // prettier-ignore
      // false positive
      // eslint-disable-next-line tailwindcss/no-contradicting-classname
      className="pointer-events-none absolute inset-0 z-[1]
        [--start-1:rgba(255,204,239,.05)]
        [--end-1:hsl(var(--color-pri-base)/.8)]
        dark:[--start-1:hsl(var(--color-pri-darker))]
        dark:[--end-1:hsl(var(--color-pri-base)/.9)]

        [--start-2:transparent]
        [--end-2:hsl(var(--color-pri-base)/.6)]
        dark:[--start-2:rgba(255,204,239,.1)]
        dark:[--end-2:hsl(var(--color-pri-base)/.8)]

        mix-blend-darken
        dark:mix-blend-lighten

        max-sm:![mask-size:300vw_200px]
        max-sm:![mask-position:center_calc(100%-100px)]

        sm:max-lg:![mask-origin:bottom]
        sm:max-lg:![mask-size:250%_300px]
        sm:max-lg:![mask-position:center_calc(100%-30px)]

        max-lg:rotate-180
      "
      style={{
        maskImage: `url(${blurBean.src})`,
        WebkitMaskImage: `url(${blurBean.src})`,
        maskPosition: "center 260px",
        WebkitMaskPosition: "center 260px",
        maskSize: "200% 100%",
        WebkitMaskSize: "200% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskOrigin: "top",
      }}
    >
      <StripesDecoration
        evenClassName="bg-[linear-gradient(180deg,var(--start-1)_0%,var(--end-1)_200%)]"
        oddClassName="bg-[linear-gradient(180deg,var(--start-2)_0%,var(--end-2)_200%)]"
      />
    </div>
  )
}

function useFooterSections(extraLinks: FooterLink[]): {
  sections: FooterSection[]
  hasConferenceBox: boolean
} {
  const { normalizePagesResult } = useConfig()

  const sections: FooterSection[] = []
  const singleLinks: FooterLink[] = []
  let hasConferenceBox = false

  for (const item of normalizePagesResult.topLevelNavbarItems) {
    if (
      (item.type === "page" || item.type === "menu") &&
      item.children?.length &&
      sections.length < FOOTER_SECTIONS_COUNT - 1
    ) {
      sections.push({
        title: item.title,
        route: item.route,
        links: (item.children || [])
          .filter(child => child.route)
          .slice(0, MAX_LINKS_PER_SECTION)
          .map(child => ({ title: child.title, route: child.route })),
      })
    } else if (singleLinks.length < MAX_LINKS_PER_SECTION) {
      if (item.route && item.route.startsWith("/conf/")) {
        hasConferenceBox = true
      } else {
        singleLinks.push({ title: item.title, route: item.route })
      }
    }
  }

  singleLinks.push(...extraLinks)
  sections.push({ links: singleLinks })

  return { sections, hasConferenceBox }
}
