import { Metadata } from "next"

import { NavbarPlaceholder } from "../components/navbar"

import Resources from "./client-mdx"
import "./prose.css"

export const metadata: Metadata = {
  title: "Resources | 2025",
}

export default function ResourcesPage() {
  return (
    <>
      <NavbarPlaceholder className="top-0 bg-neu-0 before:bg-white/30 dark:bg-neu-0 dark:before:bg-blk/40" />
      <main className="gql-all-anchors-focusable gql-conf-navbar-strip text-neu-900 before:bg-white/40 before:dark:bg-blk/30">
        <div className="gql-conf-container gql-conf-section gql-prose">
          <Resources />
        </div>
      </main>
    </>
  )
}
