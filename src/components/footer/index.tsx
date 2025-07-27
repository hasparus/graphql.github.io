import NextLink from "next/link"
import { useConfig, useThemeConfig } from "nextra-theme-docs"

import { GraphQLWordmarkLogo } from "@/icons"
import { SocialIcons } from "@/app/conf/_components/social-icons"
import { StripesDecoration } from "@/app/conf/_design-system/stripes-decoration"
import blurBean from "@/app/conf/2025/components/footer/blur-bean.webp"

import { renderComponent } from "../utils"
import { Anchor } from "@/app/conf/_design-system/anchor"

interface FooterLink {
  title: string
  route: string
}

interface FooterSection {
  title?: string
  route?: string
  links: FooterLink[]
}

const FOOTER_SECTIONS_COUNT = 4
const MAX_LINKS_PER_SECTION = 5

function useFooterSections(): FooterSection[] {
  const { normalizePagesResult } = useConfig()

  const sections: FooterSection[] = []
  const singleLinks: FooterLink[] = []

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
          .slice(0, MAX_LINKS_PER_SECTION)
          .map(child => ({ title: child.title, route: child.route })),
      })
    } else if (singleLinks.length < MAX_LINKS_PER_SECTION) {
      if (!item.route?.startsWith("/conf/")) {
        singleLinks.push({ title: item.title, route: item.route })
      }
    }
  }

  sections.push({ links: singleLinks })
  return sections
}

export function Footer() {
  const sections = useFooterSections()
  const themeConfig = useThemeConfig()

  // const footerSections: FooterSection[] =
  //   normalizePagesResult.topLevelNavbarItems
  //     .filter(item => item.type === "page" || item.type === "menu")
  //     .filter(item => item.children)
  //     .map(item => {
  //       return {
  //         title: item.title,
  //         route: item.route,
  //         links: (item.children || [])
  //           .filter(
  //             child =>
  //               child.type === "doc" &&
  //               child.route &&
  //               !child.name.startsWith("--"),
  //           )
  //           .slice(0, MAX_LINKS_PER_SECTION)
  //           .map(child => ({
  //             title: child.title || child.name,
  //             route: child.route,
  //           })),
  //       }
  //     })

  return (
    <footer className="typography-menu relative !bg-neu-100 text-neu-900 dark:!bg-neu-0 max-md:px-0 max-md:pt-0">
      <Stripes />

      <div className="mx-auto max-w-[120rem] border-neu-400 dark:border-neu-100 3xl:border-x">
        {/* TODO: Move themeSwitch to the bottom section and remove padding. */}
        {/* Top section with logo and theme switch */}
        <div className="flex flex-wrap justify-between gap-4 p-4 max-md:w-full md:p-6 2xl:px-10">
          <NextLink href="/" className="nextra-logo flex items-center">
            <GraphQLWordmarkLogo className="h-6" title="GraphQL" />
          </NextLink>
          {themeConfig.darkMode && (
            <div className="flex items-center">
              {renderComponent(themeConfig.themeSwitch.component)}
            </div>
          )}
        </div>

        {/* Navigation grid */}
        <ul className="grid grid-cols-2 gap-px bg-neu-400 py-px dark:bg-neu-100 lg:grid-cols-4">
          {sections.map((section, i) => (
            <li className="bg-neu-100 dark:bg-neu-0" key={i}>
              <div className="relative flex flex-col px-4 py-8 3xl:px-6 3xl:py-10">
                {section.title && (
                  <h3 className="block h-full font-bold lg:mb-4 3xl:mb-10">
                    {section.route ? (
                      <Anchor
                        className="gql-focus-visible block p-3 underline-offset-4 hover:underline"
                        href={section.route}
                      >
                        {section.title}
                      </Anchor>
                    ) : (
                      <span className="block p-3">{section.title}</span>
                    )}
                  </h3>
                )}
                {section.links.map(link => (
                  <Anchor
                    key={link.route}
                    href={link.route}
                    className="gql-focus-visible block h-full p-3 underline-offset-4 hover:underline"
                  >
                    {link.title}
                  </Anchor>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <div className="relative flex items-center justify-between gap-10 p-4 max-lg:flex-col md:px-6 2xl:px-10">
          <div className="flex flex-col font-light max-md:gap-5">
            <p>{renderComponent(themeConfig.footer.content)}</p>
          </div>
          <SocialIcons className="[&>a:focus]:text-current [&>a:focus]:ring-transparent [&>a:hover]:bg-neu-900/10 [&>a:hover]:text-current" />
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
      className="pointer-events-none absolute inset-0
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
