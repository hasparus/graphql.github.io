import Resources from "./client-mdx"

import { clsx } from "clsx"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resources | 2025",
}

export default function ResourcesPage() {
  return (
    <main>
      <div
        className={clsx(
          "container my-10 flex flex-col md:my-20",
          "prose max-w-screen-xl",
          "text-white prose-headings:text-white prose-a:text-white prose-strong:text-white",
          "prose-a:w-fit prose-a:transition-colors hover:prose-a:text-primary",
        )}
      >
        <Resources />
      </div>
    </main>
  )
}
