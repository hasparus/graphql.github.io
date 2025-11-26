import { clsx } from "clsx"

import CaretDown from "@/app/conf/_design-system/pixelarticons/caret-down.svg?svgr"

export interface EyebrowProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  className?: string
  as?: "p" | "span" | "h2" | "h3" | "h4" | "h5" | "h6"
}

export function Eyebrow({
  children,
  className,
  as = "span",
  ...rest
}: EyebrowProps) {
  const Root = as
  return (
    <Root
      className={clsx(
        "typography-menu flex items-center gap-1 text-pri-base",
        className,
      )}
      {...rest}
    >
      <CaretDown className="size-4 translate-x-[0.5px] -rotate-90" />
      {children}
    </Root>
  )
}
