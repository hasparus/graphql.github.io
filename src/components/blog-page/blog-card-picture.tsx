import { clsx } from "clsx"

export function BlogCardPicture({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return <div className={clsx("bg-neu-50 p-4", className)}>{children}</div>
}
