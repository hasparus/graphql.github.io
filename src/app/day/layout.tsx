import { ReactElement, ReactNode } from "react"
import { Metadata } from "next"

import { NewFontsStyleTag } from "../fonts"
import "../colors.css"

import { Navbar } from "./2026/components/navbar"
import { Footer } from "./2026/components/footer"

import { ThemeProvider } from "next-themes"
import { GraphQLDayLogoLink } from "./2026/components/graphql-day-logo-link"

export const metadata = {
  title: {
    absolute: "",
    template: "%s | GraphQL Day",
  },
} satisfies Metadata

export default function DayLayout({
  children,
}: {
  children: ReactNode
}): ReactElement {
  return (
    <>
      <NewFontsStyleTag />
      <Navbar
        links={[
          { children: "All Events", href: "/day" },
          { children: "FAQ", href: "#faq" },
        ]}
      />
      <ThemeProvider attribute="class">
        <div className="bg-neu-0 text-neu-900 antialiased">{children}</div>
      </ThemeProvider>
      <Footer
        logo={<GraphQLDayLogoLink />}
        links={[
          { children: "FOST", href: "https://www.joinfost.io" },
          { children: "GraphQL", href: "/" },
          { children: "GraphQLConf 2026", href: "/conf/2026" },
          {
            children: "Get Tickets",
            href: "https://portal.joinfost.io/event/future-of-software-technologies-singapore-2026/9521470b-6661-4c85-8594-b74d9d7cf2e3/graphql-day-at-fost-singapore",
          },
          [
            {
              children: "Code of Conduct",
              href: "/day/2026/code-of-conduct",
            },
            {
              children: "FOST Manifesto",
              href: "https://www.futureofsoftwaretechnologies.com/manifesto",
            },
          ],
        ]}
      />
    </>
  )
}
