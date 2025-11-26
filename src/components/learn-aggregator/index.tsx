import { StripesDecoration } from "@/app/conf/_design-system/stripes-decoration"

import blurBean from "./learn-blur-bean.webp"

// https://www.figma.com/design/aPUvZDSxJfYDJtPd7GF2sB/GraphQL.org--Working-File?node-id=5768-48498&m=dev
export function TeaserSection() {
  return <div className="flex flex-col gap-6 lg:gap-8"></div>
}

export function LearnHeroStripes() {
  return (
    <div
      role="presentation"
      // eslint-disable-next-line tailwindcss/no-contradicting-classname
      className="pointer-events-none bg-neu-50 absolute inset-0 h-[480px] [--end-1:#FFF] [--end-2:rgb(255_204_239/.2)] [--start-1:#FFEAF8] [--start-2:hsl(var(--color-sec-lighter))] dark:[--end-1:hsl(var(--color-neu-0))] dark:[--start-1:hsl(var(--color-neu-100))]"
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
