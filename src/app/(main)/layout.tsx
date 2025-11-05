// @ts-expect-error: we want to import the same version as Nextra for the main page
import { ThemeProvider } from "next-themes"

import { Footer } from "../../components/footer"
import { Navbar } from "../../components/navbar/navbar"
import { NewFontsStyleTag } from "../fonts"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NewFontsStyleTag />
      <ThemeProvider attribute="class">
        <Navbar />
        <div className="bg-neu-0 text-neu-900 antialiased">{children}</div>
        <Footer />
      </ThemeProvider>
    </>
  )
}
