// @ts-expect-error: we want to import the same version as Nextra for the main page
import { ThemeProvider } from "next-themes"

import { Footer } from "../../components/footer"
import { NewFontsStyleTag } from "../fonts"
import { Navbar } from "../../components/navbar/navbar"
import { topLevelNavbarItems } from "../../components/navbar/top-level-items"
import { MenuProvider } from "./menu-provider"

import "@/globals.css"
import "@/app/colors.css"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NewFontsStyleTag />
      <ThemeProvider attribute="class">
        <MenuProvider>
          <Navbar items={topLevelNavbarItems} />
          <div className="isolate bg-neu-0 text-neu-900 antialiased">
            {children}
          </div>
          <Footer />
        </MenuProvider>
      </ThemeProvider>
    </>
  )
}
