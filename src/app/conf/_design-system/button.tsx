import { clsx } from "clsx"
import { Anchor } from "./anchor"

type Size = "md" | "lg"

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace ButtonProps {
  export interface BaseProps {
    size?: Size
  }

  export interface AnchorProps
    extends BaseProps,
      React.DetailedHTMLProps<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
      > {
    href: string
    as?: never
    className?: string
  }

  export interface ButtonProps
    extends BaseProps,
      React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      > {
    href?: never
    as?: never
    className?: string
    disabled?: boolean
    type?: "button" | "submit" | "reset"
    onClick?: React.MouseEventHandler<HTMLButtonElement>
  }

  /**
   * Use inside `<summary>` or as visual part of bigger interactive element.
   * Prefer `a` and `button` Buttons otherwise.
   */
  export interface NonInteractiveProps
    extends BaseProps,
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
    href?: never
    as: "span" | "div"
    className?: string
  }
}

export type ButtonProps =
  | ButtonProps.AnchorProps
  | ButtonProps.ButtonProps
  | ButtonProps.NonInteractiveProps

export function Button(props: ButtonProps) {
  const className = clsx(
    "relative flex items-center justify-center gap-2.5 rounded-lg font-normal text-base/none text-neu-0 font-sans h-14 px-8 data-[size=md]:h-12",
    props.className,
  )

  const styleAttrs = { "data-size": props.size }

  if ("href" in props && typeof props.href === "string") {
    const { className: _1, size: _2, children, ...rest } = props

    return (
      <Anchor className={className} {...styleAttrs} {...rest}>
        {children}
      </Anchor>
    )
  }

  if (props.as) {
    const { className: _1, size: _2, children, as, ...rest } = props
    const Root = as as "span" // we don't need HTMLDivElement type
    return (
      <Root className={className} {...styleAttrs} {...rest}>
        {children}
      </Root>
    )
  }

  const { className: _1, size: _2, children, ...rest } = props

  return (
    <button className={className} {...styleAttrs} {...rest}>
      {children}
    </button>
  )
}
