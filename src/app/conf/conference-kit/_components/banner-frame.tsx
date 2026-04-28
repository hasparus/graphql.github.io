import clsx from "clsx"

export const BANNER_W = 600
export const BANNER_H = 1412

export interface BannerFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  caption: string
}

export function BannerFrame({
  children,
  caption,
  className,
  style,
  ...rest
}: BannerFrameProps) {
  return (
    <figure className="flex flex-col gap-3">
      <div
        className={clsx(
          "relative isolate overflow-hidden border border-neu-200 font-sans dark:border-neu-50",
          className,
        )}
        style={{ width: BANNER_W, height: BANNER_H, ...style }}
        {...rest}
      >
        {children}
      </div>
      <figcaption className="font-mono text-xs uppercase tracking-wider text-neu-700">
        {caption}
        <span className="text-neu-500"> · 850 × 2000 mm · 1:2.353</span>
      </figcaption>
    </figure>
  )
}
