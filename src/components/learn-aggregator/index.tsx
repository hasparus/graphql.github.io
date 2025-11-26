import { ReactNode } from "react"

import { StripesDecoration } from "@/app/conf/_design-system/stripes-decoration"
import { Eyebrow } from "@/_design-system/eyebrow"
import ArrowDownIcon from "@/app/conf/_design-system/pixelarticons/arrow-down.svg?svgr"

import blurBean from "./learn-blur-bean.webp"

export interface TeaserSectionProps {
  eyebrow: string
  title: string
  description: string
  cta: ReactNode
  items: Array<{
    title: string
    description: string
    href: string
    icon: string
  }>
  firstIconsEager?: boolean
}
export function TeaserSection({
  eyebrow,
  title,
  description,
  cta,
  items,
  firstIconsEager,
}: TeaserSectionProps) {
  return (
    <div className="flex items-start gap-8 max-lg:flex-col lg:gap-12 xl:gap-16">
      <header className="flex max-w-[720px] flex-col gap-6 text-left">
        <div className="flex flex-col gap-6">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="typography-h2 text-pretty text-neu-900">{title}</h2>
          <p className="typography-body-md text-pretty text-neu-800">
            {description}
          </p>
          {cta}
        </div>
      </header>
      <ul className="gap-4 lg:gap-8">
        {items.map((item, index) => {
          return (
            <TeaserSectionListItem
              key={index}
              number={index + 1}
              title={item.title}
              description={item.description}
              icon={
                <img
                  src={item.icon}
                  width={72}
                  height={72}
                  className="aspect-square"
                  loading={index < 2 && firstIconsEager ? "eager" : "lazy"}
                  alt=""
                />
              }
            />
          )
        })}
      </ul>
    </div>
  )
}

// https://www.figma.com/design/aPUvZDSxJfYDJtPd7GF2sB/GraphQL.org--Working-File?node-id=6368-6983&t=JE1eYbp6gpQRUILY-4
// https://www.figma.com/design/aPUvZDSxJfYDJtPd7GF2sB/GraphQL.org--Working-File?node-id=5830-51637&t=JE1eYbp6gpQRUILY-4
interface TeaserSectionListItemProps {
  number: number
  title: string
  description: string
  icon: ReactNode
}
function TeaserSectionListItem({
  number,
  title,
  description,
  icon,
}: TeaserSectionListItemProps) {
  return (
    <li className="flex items-end gap-2 text-neu-900">
      {icon}
      <span>Lesson {number}</span>
      <strong>{title}</strong>
      <p className="typography-body-md text-pretty p-4 text-neu-900">
        {description}
      </p>
      <div className="p-4 max-lg:hidden">
        <ArrowDownIcon className="size-8 shrink-0 -rotate-90" />
      </div>
    </li>
  )
}

export function LearnHeroStripes() {
  return (
    <div
      role="presentation"
      // eslint-disable-next-line tailwindcss/no-contradicting-classname
      className="pointer-events-none absolute inset-0 h-[480px] bg-neu-50 [--end-1:#FFF] [--end-2:rgb(255_204_239/.2)] [--start-1:#FFEAF8] [--start-2:hsl(var(--color-sec-lighter))] dark:[--end-1:hsl(var(--color-neu-0))] dark:[--start-1:hsl(var(--color-neu-100))]"
      style={{
        maskImage: `url(${blurBean.src})`,
        WebkitMaskImage: `url(${blurBean.src})`,
        maskSize: "2200px",
        WebkitMaskSize: "2200px",
        maskPosition: "50% 60%",
        WebkitMaskPosition: "50% 60%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    >
      <StripesDecoration
        evenClassName="bg-[linear-gradient(180deg,var(--start-1)_-80%,var(--end-1)_102%)]"
        oddClassName="bg-[linear-gradient(180deg,var(--start-2)_-80%,var(--end-2)_102%)]"
      />
    </div>
  )
}
