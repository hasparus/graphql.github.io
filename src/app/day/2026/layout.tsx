import { ReactElement, ReactNode } from "react"
import { Metadata } from "next"

import { NewFontsStyleTag } from "../../fonts"
import "../../colors.css"

import { Navbar } from "./components/navbar"
import { Footer } from "./components/footer"

import { ThemeProvider } from "next-themes"
import { GraphQLDayLogoLink } from "./components/graphql-day-logo-link"

export const metadata = {
  description:
    "GraphQL Day @ FOST — community-organized GraphQL events at Future of Software Technologies conferences worldwide.",
  title: {
    absolute: "",
    template: "%s | GraphQL Day 2026",
  },
  keywords: ["GraphQL", "GraphQL Day", "FOST", "Conference", "2026"],
} satisfies Metadata

export default function Layout({
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
          [
            {
              children: "Code of Conduct",
              href: "/day/2026/code-of-conduct",
            },
          ],
        ]}
      />
    </>
  )
}
