import { Marquee } from "@/app/conf/_design-system/marquee"
import CodeIcon from "../pixelarticons/code.svg?svgr"
import { Fragment } from "react"

const keywords = [
  ["COMMUNITY", "DEVELOPER EXPERIENCE", "APIs", "TOOLS & LIBRARIES"],
  ["OPEN SOURCE", "FEDERATION", "ECOSYSTEMS", "TRACING & OBSERVABILITY"],
  ["BEST PRACTICES", "WORKSHOPS", "SCHEMAS", "SECURITY"],
]

export function MarqueeUnderHero() {
  return (
    <section className="space-y-2 pt-6 font-mono text-xl/none text-pri-base md:pt-12 md:text-[56px]/none lg:pt-16 xl:pt-24">
      {keywords.map((row, i) => (
        <Marquee
          key={i}
          gap={16}
          speed={35}
          speedOnHover={15}
          className="*:select-none"
          reverse={i % 2 === 1}
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
