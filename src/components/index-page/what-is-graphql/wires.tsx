import { Pre } from "@/components/pre"
import { Code } from "nextra/components"

import {
  DesktopIcon,
  PhoneIcon,
  TelevisionIcon,
  TabletIcon,
  WristwatchIcon,
  CloudIcon,
  LabirynthIcon,
  ModemIcon,
  ServerIcon,
} from "./icons"

import QueryMdx from "./api-gateway-query.mdx"
import clsx from "clsx"
import { ComponentPropsWithoutRef, useReducer } from "react"

function ClientEdges({
  highlighted: pathHighlighted,
}: {
  highlighted?: number
}) {
  const paths = [
    "M514.5 220H424.5V76H72",
    "M446 220H424.5V112H144",
    "M446 220H424.5V147H72",
    "M446 220H424.5V184H144",
    "M528 220H514.206L72 220",
    "M528 220L424.866 220V256H144",
    "M446 220L424.5 220V291.75H72",
    "M528.5 220H424.5V328H144",
    "M528 220H424.772V365H72",
  ]

  return (
    <>
      {paths.map((path, index) => (
        <path
          key={index}
          d={path}
          stroke={
            pathHighlighted === index
              ? `url(#paint_lr_dark_linear_671_9150)`
              : `url(#paint_lr_light_linear_671_9150)`
          }
          strokeWidth={pathHighlighted === index ? "2" : "1"}
        />
      ))}
    </>
  )
}

function ServerEdges({ highlighted }: { highlighted?: number }) {
  const paths = [
    "M696 159.5H811.5V75H1176",
    "M696 175.5L833.5 175.5V112H1104.5",
    "M696 191.5H855.5V148.5H1176",
    "M696 206.5L876 206.5V184.5H1104",
    "M696 220.5H704.5H1176",
    "M696 234.5L876 234.5V256.5H1104",
    "M696 249.5H855.5V292.5H1176",
    "M696 265.5L833.5 265.5V329H1104",
    "M696 281.5H811.5V366H1176",
  ] as const

  return (
    <>
      {paths.map((d, index) => (
        <path
          key={index}
          d={d}
          stroke={
            highlighted === index
              ? `url(#paint_sr_dark_linear_671_9150)`
              : `url(#paint_sr_light_linear_671_9150)`
          }
          strokeWidth={highlighted === index ? "2" : "1"}
        />
      ))}
    </>
  )
}

function Box({
  transform,
  fill = "hsl(var(--color-neu-100))",
  children,
  className,
}: {
  transform: string
  fill?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <g
      transform={transform}
      className={clsx(
        "[&>path]:translate-x-4 [&>path]:translate-y-4 [:where(&>path:not([fill]))]:fill-neu-600",
        className,
      )}
    >
      <rect width="56" height="56" fill={fill} />
      {children}
    </g>
  )
}

function ClientBoxes({ highlighted }: { highlighted?: number }) {
  /* eslint-disable react/jsx-key */
  const boxes = [
    ["translate(16, 48)", <DesktopIcon />],
    ["translate(88, 84)", <PhoneIcon />],
    ["translate(16, 120)", <PhoneIcon />],
    ["translate(88, 156)", <WristwatchIcon />],
    ["translate(16, 192)", <TelevisionIcon />],
    ["translate(88, 228)", <DesktopIcon />],
    ["translate(16, 264)", <TabletIcon />],
    ["translate(88, 300)", <PhoneIcon />],
    ["translate(16, 336)", <WristwatchIcon />],
  ] as const
  /* eslint-enable react/jsx-key */

  return (
    <>
      {boxes.map(([transform, children], index) => {
        const isHighlighted = index === highlighted
        return (
          <Box
            key={index}
            transform={transform}
            fill={
              isHighlighted
                ? "hsl(var(--color-neu-300))"
                : "hsl(var(--color-neu-100))"
            }
            className={
              isHighlighted
                ? "[&_path]:fill-neu-800 dark:[&_path]:fill-neu-0"
                : undefined
            }
          >
            {children}
          </Box>
        )
      })}
    </>
  )
}

function ServerBoxes({ highlighted }: { highlighted?: number }) {
  /* eslint-disable react/jsx-key */
  const boxes = [
    ["translate(1176, 48)", <LabirynthIcon />],
    ["translate(1104, 84)", <ServerIcon />],
    ["translate(1176, 120)", <ModemIcon />],
    ["translate(1104, 156)", <CloudIcon />],
    ["translate(1176, 192)", <ServerIcon />],
    ["translate(1104, 228)", <LabirynthIcon />],
    ["translate(1176, 264)", <ServerIcon />],
    ["translate(1104, 300)", <ServerIcon />],
    ["translate(1176, 336)", <CloudIcon />],
  ] as const
  /* eslint-enable react/jsx-key */

  return (
    <>
      {boxes.map(([transform, children], index) => {
        const isHighlighted = index === highlighted
        return (
          <Box
            key={index}
            transform={transform}
            fill={
              isHighlighted
                ? "hsl(var(--color-neu-300))"
                : "hsl(var(--color-neu-100))"
            }
            className={
              isHighlighted
                ? "[&_path]:fill-neu-800 dark:[&_path]:fill-neu-0"
                : undefined
            }
          >
            {children}
          </Box>
        )
      })}
    </>
  )
}

// SVG gradients and definitions
function SVGDefinitions() {
  return (
    <defs>
      <linearGradient
        id="paint_lr_light_linear_671_9150"
        x1="446"
        y1="41.7739"
        x2="266.078"
        y2="41.7739"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="hsl(var(--color-neu-100))" />
        <stop offset="1" stopColor="hsl(var(--color-neu-600))" />
      </linearGradient>
      <linearGradient
        id="paint_lr_dark_linear_671_9150"
        x1="446"
        y1="-17.6347"
        x2="204.096"
        y2="-17.6347"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="hsl(var(--color-neu-700))" />
        <stop offset="1" stopColor="hsl(var(--color-neu-300))" />
      </linearGradient>

      <linearGradient
        id="paint_sr_light_linear_671_9150"
        x1="696"
        y1="0"
        x2="937.904"
        y2="0"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="hsl(var(--color-neu-100))" />
        <stop offset="1" stopColor="hsl(var(--color-neu-600))" />
      </linearGradient>
      <linearGradient
        id="paint_sr_dark_linear_671_9150"
        x1="696"
        y1="0"
        x2="937.904"
        y2="0"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="hsl(var(--color-neu-700))" />
        <stop offset="1" stopColor="hsl(var(--color-neu-300))" />
      </linearGradient>
      <clipPath id="clip0_671_9150">
        <rect x="514" y="113.5" width="220" height="220" rx="8" fill="white" />
      </clipPath>
      <clipPath id="clip1_671_9150">
        <path d="M514 113.5H734V333.5H514V113.5Z" fill="white" />
      </clipPath>
    </defs>
  )
}

const components = {
  pre: (props: ComponentPropsWithoutRef<typeof Pre>) => (
    <Pre
      {...props}
      containerClassName="!absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:scale-75"
      className="bg-neu-0"
    />
  ),
  code: Code,
}

export function Wires({ className }: { className?: string }) {
  // 1: Query visible, first client wire selected.
  const STEPS = 3
  const [step, inc] = useReducer(x => (x + 1) % STEPS, 1)

  return (
    <div className={clsx(className, "relative")}>
      <svg
        id="what-is-graphql--wires"
        width="1248"
        height="448"
        viewBox="0 0 1248 448"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="GraphQL allows you to build API Gateways to bring data from multiple sources to your clients in a single query"
        className="relative h-auto w-full"
      >
        <ClientEdges highlighted={step === 0 ? 0 : undefined} />
        <ClientBoxes highlighted={step === 0 ? 0 : undefined} />
        <ServerEdges highlighted={step === 1 ? 0 : undefined} />
        <ServerBoxes highlighted={step === 1 ? 0 : undefined} />
        <SVGDefinitions />
      </svg>
      <QueryMdx components={components} />
    </div>
  )
}
