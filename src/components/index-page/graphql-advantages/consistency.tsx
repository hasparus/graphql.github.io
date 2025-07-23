import { ComponentPropsWithoutRef, useEffect, useRef } from "react"
import { clsx } from "clsx"
import { Code } from "nextra/components"

import { Pre } from "@/components/pre"

import { Query, Schema } from "../../code-blocks"

const components = {
  pre: (props: ComponentPropsWithoutRef<typeof Pre>) => (
    <Pre
      {...props}
      // todo: this bg style might need to become global for all code blocks
      className={clsx(
        props.className,
        "!bg-neu-0/[.48] backdrop-blur-[6px] max-xs:[&_span]:!text-xs",
      )}
      tabIndex={-1}
    />
  ),
  code: Code,
}

export function ConsistencyFigure() {
  const queryRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const [queryCode, responseCode] = queryRef.current!.querySelectorAll(
      "code",
    ) as unknown as HTMLElement[]
    let line = 0
    const typeLines = [1, 5, 6, 5, 7, 12, 13, 8, 17, 18, 19, 12]
    const queryLines = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13]
    let timer: any

    const highlightLine = () => {
      // Reset previous line
      queryCode.children[queryLines.at(line - 1)!].classList.remove(
        "highlighted",
      )
      responseCode.children[typeLines.at(line - 1)!].classList.remove(
        "highlighted",
      )

      // TODO: Whenever we're adding .highlighted, we should also ensure it's visible on screen.
      // We can simplify this by scrolling to bottom in last 3 steps.
      queryCode.children[queryLines.at(line)!].classList.add("highlighted")
      responseCode.children[typeLines.at(line)!].classList.add("highlighted")
      line = (line + 1) % typeLines.length

      timer = setTimeout(highlightLine, 1_000 + Math.random() * 200)
    }
    highlightLine()
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      id="type-system"
      className="nextra-codeblocks flex w-full bg-gradient-to-b from-transparent to-sec-lighter px-[14px] py-[30px] dark:to-sec-darker/25 xl:px-[46px] [&_pre]:!h-[420px]"
    >
      <div
        className="nextra-codeblocks grid w-full grid-cols-2 [&_.highlighted]:!bg-pri-lighter/50 dark:[&_.highlighted]:!bg-neu-200/10"
        aria-hidden
        ref={queryRef}
      >
        <Query components={components} />
        <Schema components={components} />
      </div>
    </section>
  )
}
