import { DocsThemeConfig, ThemeSwitch, useConfig } from "nextra-theme-docs"

import { Navbar } from "@/components/navbar/navbar"
import { useRouter } from "next/router"

import { GraphQLWordmarkLogo } from "./src/icons"
import { Footer } from "@/components/footer"

const graphQLLogo = (
  <GraphQLWordmarkLogo className="nextra-logo h-6" title="GraphQL" />
)

export default {
  backgroundColor: {
    dark: "27,27,27",
  },
  head: function useHead() {
    const { frontMatter, title: pageTitle } = useConfig()
    const { asPath } = useRouter()

    const title = `${pageTitle}${asPath === "/" ? "" : " | GraphQL"}`
    const { description, canonical, image } = frontMatter
    return (
      <>
        <title>{title}</title>
        <meta property="og:title" content={title} key="meta-og-title" />
        {description && (
          <>
            <meta
              name="description"
              content={description}
              key="meta-description"
            />
            <meta
              property="og:description"
              content={description}
              key="meta-og-description"
            />
          </>
        )}
        {canonical && <link rel="canonical" href={canonical} />}
        {image && <meta name="og:image" content={image} />}
        <meta property="og:image" content="/img/og-image.png" />
        <meta property="twitter:site" content="@graphql" />
      </>
    )
  },
  // Hidden for now, Design is discussing it.
  // banner: {
  //   content: (
  //     <>
  //       📣 GraphQLConf 2025 • Sept 08-10 • Amsterdam • Early bird tickets
  //       available &amp; sponsorship opportunities open •{" "}
  //       <NextLink
  //         href="/conf/2025"
  //         className="underline after:font-sans after:content-['_→']"
  //       >
  //         Learn more
  //       </NextLink>
  //     </>
  //   ),
  //   key: "graphqlconf-2024",
  // },
  logo: graphQLLogo,
  docsRepositoryBase:
    "https://github.com/graphql/graphql.github.io/tree/source",
  color: {
    hue: 319,
    lightness: {
      light: 44.1,
      dark: 90,
    },
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  footer: {
    component: () => (
      <Footer
        extraLinks={[
          {
            title: "Community Grant",
            route: "https://graphql.org/foundation/community-grant/",
          },
          {
            title: "Code of Conduct",
            route: "https://graphql.org/codeofconduct/",
          },
          {
            title: "Brand",
            route: "https://graphql.org/brand/",
          },
          // {
          //   title: "Swag Shop",
          //   route: "https://store.graphql.org/",
          // },
        ]}
      />
    ),
    content: "Copyright © 2025 The GraphQL Foundation. All rights reserved.",
  },
  navbar: {
    component: Navbar,
    extraContent: (
      <ThemeSwitch lite className="max-lg:hidden [&_span]:hidden" />
    ),
  },
  toc: {
    backToTop: true,
  },
  search: {
    placeholder: "Search…",
  },
  // TODO: @dimaMachina try to remove pnpm patch for `nextra` package later
  // components: {
  //   // Override `next/image` imports from `nextra-theme-docs`
  //   img: (props: any) =>
  //     createElement(typeof props.src === "object" ? NextImage : "img", props),
  // },
} satisfies DocsThemeConfig
