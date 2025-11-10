// @ts-expect-error: we want to import the same version as Nextra for the main page
import { ThemeProvider } from "next-themes"

import { Footer } from "../../components/footer"
import { NewFontsStyleTag } from "../fonts"
import { Navbar } from "../../components/navbar/navbar"
import {
  directories,
  docsDirectories,
  topLevelNavbarItems,
} from "../../components/navbar/top-level-items"
import { Sidebar } from "../../components/sidebar"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NewFontsStyleTag />
      <ThemeProvider attribute="class">
        <Navbar items={topLevelNavbarItems} />
        <Sidebar
          includePlaceholder={false}
          toc={[]}
          docsDirectories={docsDirectories}
          fullDirectories={directories}
        />
        <div className="isolate bg-neu-0 text-neu-900 antialiased">
          {children}
        </div>
        <Footer />
      </ThemeProvider>
    </>
  )
}
