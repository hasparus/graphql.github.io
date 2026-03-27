import { ReactElement, ReactNode } from "react"
import { Metadata } from "next"

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
  return <>{children}</>
}
