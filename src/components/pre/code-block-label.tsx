import cn from "clsx"
import type { FC, ReactElement, ReactNode } from "react"

import classes from "./pre.module.css"

interface CodeBlockLabelProps {
  text: ReactNode
  icon?: FC<{ className?: string }>
  button?: ReactElement | false
}

export function CodeBlockLabel({
  text,
  icon: Icon,
  button,
}: CodeBlockLabelProps): ReactElement {
  return (
    <div
      className={cn(
        classes.label,
        "flex items-center gap-1.5 rounded-t-md border border-b-0 border-neu-200 bg-neu-0/[.64] px-4 py-2 text-sm text-neu-0/[.64] text-neu-800 backdrop-blur-[6px] dark:border-neu-50",
      )}
    >
      {Icon && <Icon className="_h-4 _w-auto _max-w-6 _shrink-0" />}
      <span className="_truncate">{text}</span>
      {button}
    </div>
  )
}
