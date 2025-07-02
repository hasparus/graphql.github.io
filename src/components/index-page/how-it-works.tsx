import Link from "next/link"
import { CodeA, CodeB, CodeC } from "../code-blocks"
import { clsx } from "clsx"

export function HowItWorks() {
  return (
    <div className="[background:url('/img/graph-wash.png'),#171e26_repeat_center_center] xl:py-20">
      <div className="conf-block container">
        <section
          className={clsx(
            "flex flex-wrap items-center justify-center gap-14 max-sm:flex-col",
            "[&_h3]:text-2xl [&_h3]:text-white max-lg:[&_h3]:text-center",
            "[&_pre]:!bg-transparent [&_pre]:ring-0 [&_pre_span]:text-[--shiki-dark]",
            "[&_h3]:font-extralight",
            "[&_code]:whitespace-pre-wrap" /* fix scroll on mobile for code-blocks */,
          )}
        >
          <div>
            <h3>Describe your data</h3>
            <CodeA />
          </div>

          <div>
            <h3>Ask for what you want</h3>
            <CodeB />
          </div>

          <div>
            <h3>Get predictable results</h3>
            <CodeC />
          </div>
        </section>

        <Link
          className="index-button mx-auto mt-10 block w-fit border-white text-white"
          href="/TODO"
        >
          Try it out live
        </Link>
      </div>
    </div>
  )
}
