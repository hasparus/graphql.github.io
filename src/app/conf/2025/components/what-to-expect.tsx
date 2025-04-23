import clsx from "clsx"
import { HTMLAttributes } from "react"

interface WhatToExpectSectionProps extends HTMLAttributes<HTMLElement> {}

export default function WhatToExpectSection({
  className,
  ...rest
}: WhatToExpectSectionProps) {
  return (
    <section className={clsx("text-neu-900", className)} {...rest}>
      <h1>What to expect</h1>
      <dl className="uppercase [text-box:trim_cap]">
        <li className="p-6">
          <span className="text-[72px]">3</span> days
        </li>
        <li className="p-6">23 speakers</li>
        <li className="p-6">36 panels & workshops</li>
        <li className="p-6">1 unique venue</li>
      </dl>
    </section>
  )
}
