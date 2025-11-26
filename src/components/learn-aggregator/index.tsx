import { StripesDecoration } from "@/app/conf/_design-system/stripes-decoration"

import blurBean from "./learn-blur-bean.webp"
import { Eyebrow } from "@/_design-system/eyebrow"
import { ReactNode } from "react"

export interface TeaserSectionProps {
  eyebrow: string
  title: string
  description: string
  cta: ReactNode
}
export function TeaserSection({
  eyebrow,
  title,
  description,
  cta,
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
      <ul></ul>
    </div>
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
