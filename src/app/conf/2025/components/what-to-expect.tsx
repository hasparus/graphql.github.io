import clsx from "clsx"
import { HTMLAttributes } from "react"

interface WhatToExpectSectionProps extends HTMLAttributes<HTMLElement> {}

export default function WhatToExpectSection({
  className,
  ...rest
}: WhatToExpectSectionProps) {
  return (
    <section
      className={clsx("gql-conf-section flex gap-6 max-md:flex-col", className)}
      {...rest}
    >
      <h3 className="typography-h2 md:flex-1">What to expect</h3>
      <ul className="flex flex-col gap-6 uppercase md:flex-1">
        <ListItem number="3" text="days" />
        <ListItem number="23" text="speakers" />
        <ListItem number="36" text="panels & workshops" />
        <ListItem number="1" text="unique venue" />
      </ul>
    </section>
  )
}

function ListItem({ number, text }: { number: string; text: string }) {
  return (
    <li className="list-none bg-gradient-to-r from-[#CDF27E] p-6 dark:from-[#507501]">
      <span className="inline-block w-[87px] text-[72px]/none [text-box:trim-both_cap_alphabetic]">
        {number}
      </span>{" "}
      <span className="typography-menu ml-10 inline-block">{text}</span>
    </li>
  )
}
