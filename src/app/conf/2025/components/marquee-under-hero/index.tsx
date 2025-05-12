import { Fragment } from "react"

import { Marquee } from "@/app/conf/_design-system/marquee"

import CodeIcon from "../../pixelarticons/code.svg?svgr"

import blurWave from "./blur.webp"
import { StripesDecoration } from "@/app/conf/_design-system/stripes-decoration"

const keywords = [
  ["COMMUNITY", "DEVELOPER EXPERIENCE", "APIs", "TOOLS & LIBRARIES"],
  ["OPEN SOURCE", "FEDERATION", "ECOSYSTEMS", "TRACING & OBSERVABILITY"],
  ["BEST PRACTICES", "WORKSHOPS", "SCHEMAS", "SECURITY"],
]

export function MarqueeUnderHero() {
  return (
    <section className="relative pt-4 font-mono text-xl/none text-pri-base max-sm:pb-1 sm:pt-6 md:space-y-2 md:pt-12 md:text-[56px]/none xl:pt-16">
      <Stripes />
      {keywords.map((row, i) => (
        <Marquee
          key={i}
          gap={16}
          speed={35}
          speedOnHover={15}
          className="relative *:select-none"
          reverse={i % 2 === 1}
          drag
        >
          {row.map((keyword, j) => (
            <Fragment key={keyword}>
              <span>{keyword}</span>
              {j !== row.length - 1 && (
                <CodeIcon className="size-8 text-pri-dark dark:text-pri-light md:size-10" />
              )}
            </Fragment>
          ))}
        </Marquee>
      ))}
    </section>
  )
}

function Stripes() {
  return (
    <div
      role="presentation"
      // prettier-ignore
      // false positive
      // eslint-disable-next-line tailwindcss/no-contradicting-classname
      className="pointer-events-none absolute inset-0 -bottom-1/2

    [--start:hsl(var(--color-pri-light)/.6)]
    [--end:hsl(var(--color-pri-lighter)/.05)]
    dark:[--start:hsl(320_86_20/.6)]
    dark:[--end:hsl(var(--color-pri-base)/.025)]

    [mask-size:400%_100%]
    sm:[mask-size:cover]
  "
      style={{
        maskImage: `url(${blurWave.src})`,
        WebkitMaskImage: `url(${blurWave.src})`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    >
      <StripesDecoration oddClassName="bg-[linear-gradient(180deg,var(--start)_0%,var(--end)_100%)]" />
    </div>
  )
}
