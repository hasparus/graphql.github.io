import NextLink from "next/link"
import ArrowDownIcon from "../../pixelarticons/arrow-down.svg?svgr"

export function BackLink({
  year,
  kind,
}: {
  year: "2025"
  kind: "speakers" | "sessions" | "schedule"
}) {
  return (
    <NextLink
      href={`/conf/${year}/${kind}`}
      className="group cursor-pointer !no-underline transition-all typography-link"
    >
      <span className="flex items-center gap-2">
        <div className="group-hover:animate-arrow-left group-focus:animate-arrow-left">
          <ArrowDownIcon className="inline-block size-8 rotate-90" />
        </div>
        Back to {capitalize(kind)}
      </span>
    </NextLink>
  )
}

function capitalize(str: string) {
  return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase()
}
