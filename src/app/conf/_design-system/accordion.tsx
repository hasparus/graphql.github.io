"use client"

import ArrowDown from "@/app/conf/_design-system/pixelarticons/arrow-down.svg?svgr"

export interface AccordionItem {
  title: string
  description: React.ReactNode
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[]
  multiple?: boolean
}

export function Accordion({
  items,
  multiple = false,
  ...rest
}: AccordionProps) {
  return (
    <div
      className="grow space-y-4"
      onToggle={event => {
        if (!multiple) {
          const allDetails = event.currentTarget.querySelectorAll("details")
          allDetails.forEach(details => {
            if (details !== event.target) {
              details.open = false
            }
          })
        }
      }}
      {...rest}
    >
      {items.map((item, index) => (
        <details
          open={index === 0}
          key={index}
          className="group/q w-full border border-sec-darker @container"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 border-sec-darker p-2 px-3 focus:outline-none group-open/q:border-b [&::-webkit-details-marker]:hidden">
            <span className="select-none typography-body-lg">{item.title}</span>
            <ArrowDown className="size-10 shrink-0 text-sec-darker group-open/q:rotate-180" />
          </summary>
          <div className="text-pretty p-3 typography-body-md">
            {item.description}
          </div>
        </details>
      ))}
    </div>
  )
}
