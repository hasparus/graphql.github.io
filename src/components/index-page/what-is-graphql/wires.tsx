import clsx from "clsx"
import {
  ComponentPropsWithoutRef,
  Fragment,
  ReactNode,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react"
import { throttle } from "@/app/conf/_design-system/utils/throttle"

import { Code } from "nextra/components"

import { Pre } from "@/components/pre"

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
import ResponseMdx from "./api-gateway-response.mdx"
import styles from "./wires.module.css"

const bigScreenClientEdges = [
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

function ClientEdges({
  highlightedEdge,
  highlightedVisible,
  edges,
}: {
  highlightedEdge?: number
  highlightedVisible: boolean
  edges: string[]
}) {
  return (
    <>
      {moveHighlightedToTop(
        highlightedEdge,
        edges.map((path, index) => (
          <Fragment key={index}>
            <path
              d={path}
              stroke="url(#paint_lr_light_linear_671_9150)"
              strokeWidth="1"
            />
            {highlightedEdge === index && (
              <path
                d={path}
                stroke="url(#paint_lr_dark_linear_671_9150)"
                strokeWidth="3"
                className={highlightedVisible ? "opacity-100" : "opacity-0"}
              />
            )}
          </Fragment>
        )),
      )}
    </>
  )
}

const bigScreenServerEdges = [
  "M696 159.5H811.5V75H1176",
  "M696 175.5L833.5 175.5V112H1104.5",
  "M696 191.5H855.5V148.5H1176",
  "M696 206.5L876 206.5V184.5H1104",
  "M696 220.5H704.5H1176",
  "M696 234.5L876 234.5V256.5H1104",
  "M696 249.5H855.5V292.5H1176",
  "M696 265.5L833.5 265.5V329H1104",
  "M696 281.5H811.5V366H1176",
]

function ServerEdges({
  highlighted,
  highlightedVisible,
  edges,
}: {
  highlighted: number[]
  highlightedVisible: boolean
  edges: string[]
}) {
  return (
    <>
      {edges.map((d, index) => {
        const isHighlighted = highlighted?.includes(index)
        return (
          <Fragment key={index}>
            <path
              d={d}
              strokeWidth={1}
              className="stroke-[url(#paint_sr_light_linear_671_9150)]"
            />
            {isHighlighted && (
              <path
                d={d}
                strokeWidth={3}
                className={clsx(
                  highlightedVisible ? "opacity-100" : "opacity-0",
                  index % 2
                    ? "stroke-[url(#paint_sr_pri_highlight_linear_671_9150)] motion-reduce:stroke-[url(#paint_sr_pri_highlight_linear_static_671_9150)]"
                    : "stroke-[url(#paint_sr_sec_highlight_linear_671_9150)] motion-reduce:stroke-[url(#paint_sr_sec_highlight_linear_static_671_9150)]",
                )}
              />
            )}
          </Fragment>
        )
      })}
    </>
  )
}

function Box({
  transform,
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
        "fill-neu-100 [&>path]:translate-x-3 [&>path]:translate-y-3 sm:[&>path]:translate-x-4 sm:[&>path]:translate-y-4 [:where(&>path:not([fill]))]:fill-neu-600",
        className,
      )}
    >
      <rect className="size-[48px] sm:size-[56px]" />
      {children}
    </g>
  )
}

/* eslint-disable react/jsx-key */
const bigScreenClientBoxes: Array<[string, React.ReactNode]> = [
  ["translate(16, 48)", <DesktopIcon />],
  ["translate(88, 84)", <PhoneIcon />],
  ["translate(16, 120)", <PhoneIcon />],
  ["translate(88, 156)", <WristwatchIcon />],
  ["translate(16, 192)", <TelevisionIcon />],
  ["translate(88, 228)", <DesktopIcon />],
  ["translate(16, 264)", <TabletIcon />],
  ["translate(88, 300)", <PhoneIcon />],
  ["translate(16, 336)", <WristwatchIcon />],
]
/* eslint-enable react/jsx-key */

function ClientBoxes({
  highlighted,
  boxes,
}: {
  highlighted?: number
  boxes: Array<[string, React.ReactNode]>
}) {
  return (
    <>
      {boxes.map(([transform, children], index) => {
        const isHighlighted = index === highlighted
        return (
          <Box
            key={index}
            transform={transform}
            className={
              isHighlighted
                ? "[&_path]:fill-neu-800 dark:[&_path]:fill-neu-0 [&_rect]:fill-neu-300 dark:[&_rect]:fill-neu-400"
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

/* eslint-disable react/jsx-key */
const bigScreenServerBoxes: Array<[string, React.ReactNode]> = [
  ["translate(1176, 48)", <LabirynthIcon />],
  ["translate(1104, 84)", <ServerIcon />],
  ["translate(1176, 120)", <ModemIcon />],
  ["translate(1104, 156)", <CloudIcon />],
  ["translate(1176, 192)", <LabirynthIcon />],
  ["translate(1104, 228)", <ModemIcon />],
  ["translate(1176, 264)", <CloudIcon />],
  ["translate(1104, 300)", <CloudIcon />],
  ["translate(1176, 336)", <ServerIcon />],
]
/* eslint-enable react/jsx-key */

function ServerBoxes({
  highlighted,
  boxes,
}: {
  highlighted: number[]
  boxes: Array<[string, React.ReactNode]>
}) {
  return (
    <>
      {boxes.map(([transform, children], index) => {
        const isHighlighted = highlighted.includes(index)
        return (
          <Box
            key={index}
            transform={transform}
            className={
              isHighlighted
                ? index % 2
                  ? "fill-pri-lighter [&_path]:fill-pri-darker dark:[&_path]:fill-pri-lighter dark:[&_rect]:fill-pri-darker"
                  : "fill-sec-light [&_path]:fill-sec-darker dark:[&_path]:fill-sec-lighter dark:[&_rect]:fill-sec-darker"
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
        <stop
          stopColor="hsl(var(--color-neu-100))"
          className="dark:[stop-color:hsl(var(--color-neu-50))]"
        />
        <stop
          offset="1"
          stopColor="hsl(var(--color-neu-600))"
          className="dark:[stop-color:hsl(var(--color-neu-100))]"
        />
      </linearGradient>
      <linearGradient id="paint_lr_dark_linear_671_9150">
        <stop
          stopColor="hsl(var(--color-neu-300))"
          className="dark:[stop-color:hsl(var(--color-neu-200))]"
        >
          <animate
            attributeName="offset"
            values="-2.562;1.438;-2.562"
            dur="5s"
            repeatCount="indefinite"
          />
        </stop>
        <stop stopColor="hsl(var(--color-neu-700))">
          <animate
            attributeName="offset"
            values="-1.562;2.438;-1.562"
            dur="5s"
            repeatCount="indefinite"
          />
        </stop>
        <stop
          stopColor="hsl(var(--color-neu-300))"
          className="dark:[stop-color:hsl(var(--color-neu-200))]"
        >
          <animate
            attributeName="offset"
            values="-0.562;3.438;-0.562"
            dur="5s"
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient>
      <linearGradient
        id="paint_lr_dark_linear_static_671_9150"
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
        <stop
          stopColor="hsl(var(--color-neu-100))"
          className="dark:[stop-color:hsl(var(--color-neu-0))]"
        />
        <stop
          offset="1"
          stopColor="hsl(var(--color-neu-600))"
          className="dark:[stop-color:hsl(var(--color-neu-100))]"
        />
      </linearGradient>

      <linearGradient id="paint_sr_sec_highlight_linear_static_671_9150">
        <stop
          stopColor="hsl(var(--color-sec-dark))"
          className="dark:[stop-color:hsl(var(--color-sec-light))]"
        />
        <stop
          offset="1"
          stopColor="hsl(var(--color-sec-light))"
          className="dark:[stop-color:hsl(var(--color-sec-darker))]"
        />
      </linearGradient>
      <linearGradient id="paint_sr_sec_highlight_linear_671_9150">
        <stop
          stopColor="hsl(var(--color-sec-light))"
          className="dark:[stop-color:hsl(var(--color-sec-darker))]"
        >
          <animate
            attributeName="offset"
            values="-2.562;1.438;-2.562"
            dur="5s"
            repeatCount="indefinite"
          />
        </stop>
        <stop
          stopColor="hsl(var(--color-sec-dark))"
          className="dark:[stop-color:hsl(var(--color-sec-light))]"
        >
          <animate
            attributeName="offset"
            values="-1.562;2.438;-1.562"
            dur="5s"
            repeatCount="indefinite"
          />
        </stop>
        <stop
          stopColor="hsl(var(--color-sec-light))"
          className="dark:[stop-color:hsl(var(--color-sec-darker))]"
        >
          <animate
            attributeName="offset"
            values="-0.562;3.438;-0.562"
            dur="5s"
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient>

      <linearGradient id="paint_sr_pri_highlight_linear_static_671_9150">
        <stop
          stopColor="hsl(var(--color-pri-dark))"
          className="dark:[stop-color:hsl(var(--color-pri-light))]"
        />
        <stop
          offset="1"
          stopColor="hsl(var(--color-pri-lighter))"
          className="dark:[stop-color:hsl(var(--color-pri-darker))]"
        />
      </linearGradient>
      <linearGradient id="paint_sr_pri_highlight_linear_671_9150">
        <stop
          stopColor="hsl(var(--color-pri-lighter))"
          className="dark:[stop-color:hsl(var(--color-pri-darker))]"
        >
          <animate
            attributeName="offset"
            values="-2.562;1.438;-2.562"
            dur="5s"
            repeatCount="indefinite"
          />
        </stop>
        <stop
          stopColor="hsl(var(--color-pri-dark))"
          className="dark:[stop-color:hsl(var(--color-pri-light))]"
        >
          <animate
            attributeName="offset"
            values="-1.562;2.438;-1.562"
            dur="5s"
            repeatCount="indefinite"
          />
        </stop>
        <stop
          stopColor="hsl(var(--color-pri-lighter))"
          className="dark:[stop-color:hsl(var(--color-pri-darker))]"
        >
          <animate
            attributeName="offset"
            values="-0.562;3.438;-0.562"
            dur="5s"
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient>

      <filter id="what-is-graphql--code-backdrop">
        <feGaussianBlur stdDeviation="0 16" in="SourceGraphic" result="blur" />
        <feBlend
          in="blur"
          in2="SourceGraphic"
          mode="multiply"
          result="multiply"
        />
        <feColorMatrix
          type="saturate"
          values="2.0"
          in="multiply"
          result="saturated"
        />
        <feGaussianBlur stdDeviation="0 2" in="saturated" result="blur1" />
        <feColorMatrix
          type="saturate"
          values="1.7"
          in="blur1"
          result="blur1sat"
        />
        <feGaussianBlur stdDeviation="0 1" in="saturated" result="blur2" />
        <feBlend in="blur1sat" in2="blur2" mode="multiply" result="blur" />
      </filter>
      <filter id="what-is-graphql--code-backdrop-2">
        <feMorphology operator="erode" radius="2 2" />
        <feComponentTransfer>
          <feFuncR type="linear" slope="1.5" />
          <feFuncG type="linear" slope="1.5" />
          <feFuncB type="linear" slope="1.5" />
          <feFuncA type="linear" slope="1" />
        </feComponentTransfer>
        <feGaussianBlur stdDeviation="16" />
      </filter>
      <filter id="what-is-graphql--code-backdrop-2-dark">
        <feMorphology in="SourceGraphic" operator="dilate" radius="0 2" />
        <feGaussianBlur stdDeviation="16" result="blur" />
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.01 0.5"
          numOctaves="1"
          seed="5"
          result="turbulence"
        />
        <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
        <feDisplacementMap
          in="blur"
          in2="softMap"
          scale="110"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  )
}

const components = {
  pre: (props: ComponentPropsWithoutRef<typeof Pre>) => (
    <Pre
      {...props}
      tabIndex={-1}
      containerClassName="!absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:scale-75 pointer-events-auto"
      // the border color on white and black backgrounds blends into border-neu-200 (and border-neu-50 in dark mode)
      className="overflow-hidden border-none !bg-transparent before:absolute before:inset-0 before:-z-10 before:rounded-md before:border before:border-transparent before:bg-[rgba(55,72,13,0.12)] before:bg-clip-border before:[backdrop-filter:url(#what-is-graphql--code-backdrop)] after:absolute after:inset-[1.5px] after:z-[-9] after:rounded-[5px] after:bg-[linear-gradient(to_right,transparent,hsl(var(--color-neu-0))_15%,hsl(var(--color-neu-0))_85%,transparent)] after:[backdrop-filter:url(#what-is-graphql--code-backdrop-2)] safari:after:[backdrop-filter:blur(12px)] dark:before:border-[rgba(235,252,191,0.2)] dark:before:bg-none dark:before:backdrop-blur-xl dark:before:[backdrop-filter:url(#what-is-graphql--code-backdrop-2-dark)] dark:after:bg-[linear-gradient(to_right,hsl(var(--color-neu-0)/0.5),hsl(var(--color-neu-0)/.8)_10%,hsl(var(--color-neu-0)/.8)_83%,hsl(var(--color-neu-0)/0.4))] dark:after:[backdrop-filter:blur(24px)]"
    >
      {props.children}
    </Pre>
  ),
  code: Code,
}

export function Wires({ className }: { className?: string }) {
  const STEPS = 3
  const [step, inc] = useReducer(x => (x + 1) % STEPS, 0)

  const ref = useRef<SVGSVGElement>(null)
  const backgroundRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const animate = document.querySelector(
      "#paint_sr_pri_highlight_linear_671_9150 animate",
    )

    const onAnimationRepeat = () => {
      // we avoid spinning a second time if the user has just clicked the button
      if (backgroundRef.current?.disabled) return
      inc()
    }

    if (animate && animate instanceof SVGAnimateElement) {
      animate.addEventListener("repeatEvent", onAnimationRepeat)
    }

    return () => animate?.removeEventListener("repeatEvent", onAnimationRepeat)
  }, [])

  const onBackgroundClick = useMemo(
    () =>
      throttle(() => {
        const button = backgroundRef.current
        if (!button) return
        button.disabled = true
        inc()
        setTimeout(() => {
          button.disabled = false
        }, 750)
      }, 500),
    [],
  )

  return (
    <div
      className={clsx(
        className,
        "relative isolate max-sm:flex max-sm:min-h-[240px] max-sm:items-center",
        styles.wires,
      )}
    >
      <MobileDiagram />
      <svg
        id="what-is-graphql--wires"
        width="1248"
        height="448"
        viewBox="0 0 1248 448"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="GraphQL allows you to build API Gateways to bring data from multiple sources to your clients in a single query"
        className="relative h-auto w-full max-sm:hidden"
        ref={ref}
      >
        <ClientEdges
          highlightedEdge={0}
          highlightedVisible={step === 0}
          edges={bigScreenClientEdges}
        />
        <ClientBoxes
          highlighted={step === 0 ? 0 : undefined}
          boxes={bigScreenClientBoxes}
        />
        <ServerEdges
          highlighted={[1, 6]}
          highlightedVisible={step > 0}
          edges={bigScreenServerEdges}
        />
        <ServerBoxes
          highlighted={step > 0 ? [1, 6] : []}
          boxes={bigScreenServerBoxes}
        />
        <SVGDefinitions />
      </svg>
      <button
        ref={backgroundRef}
        tabIndex={-1}
        onClick={onBackgroundClick}
        aria-label={step === 2 ? "Show query again" : "Next step"}
        className="absolute inset-0 outline-none"
      />

      <div
        aria-hidden={step === 2}
        className={clsx(
          "pointer-events-none absolute inset-0 transition duration-[600ms]",
          styles.highlightsQuery,
          step === 2
            ? "[transform:rotateX(90deg)_translateY(60px)_translateZ(150px)]"
            : "[transform:rotateX(0deg)_translateY(0px)_translateZ(150px)]",
        )}
        style={
          {
            "--highlight-opacity": step === 1 ? 1 : 0,
            animation: step === 2 ? `${styles["query-exit"]} 600ms` : undefined,
          } as React.CSSProperties
        }
      >
        <QueryMdx components={components} />
      </div>
      <div
        aria-hidden={step !== 2}
        className={clsx(
          "[&_pre]:[anchor-name:--response-pre]",
          "pointer-events-none absolute inset-0 transition duration-[600ms]",
          styles.highlightsResponse,
          step === 2
            ? "[transform:rotateX(0deg)_translateY(0px)_translateZ(150px)]"
            : step === 1
              ? "!duration-0 [transform:rotateX(90deg)_translateY(60px)_translateZ(150px)]"
              : "[transform:rotateX(-90deg)_translateY(-60px)_translateZ(150px)]",
        )}
      >
        <ResponseMdx components={components} />
      </div>
      <Curtain />
    </div>
  )
}

function moveHighlightedToTop(index: number | undefined, nodes: ReactNode[]) {
  if (index === undefined) return nodes
  const newNodes = nodes.filter((_, i) => i !== index)
  newNodes.push(nodes[index] as ReactNode)
  return newNodes
}

function Curtain() {
  return (
    <div
      // we obscure part of the rotation with gradient so it's not garish
      className="pointer-events-none absolute bottom-0 left-[anchor(left)] right-[anchor(right)] z-[2] h-[calc((100%-anchor-size(height))/2)] -translate-x-1/2 [position-anchor:--response-pre] max-md:hidden"
      style={{
        background:
          "linear-gradient(to bottom, hsl(var(--color-neu-0)/0), hsl(var(--color-neu-0)) 50%)",
      }}
    />
  )
}

// Mobile diagram data
/* eslint-disable react/jsx-key */
const mobileClientBoxes: Array<[string, React.ReactNode]> = [
  ["translate(0, 0)", <DesktopIcon />],
  ["translate(65, 0)", <PhoneIcon />],
  ["translate(130, 0)", <PhoneIcon />],
  ["translate(195, 0)", <WristwatchIcon />],
  ["translate(260, 0)", <TelevisionIcon />],
]

const mobileServerBoxes: Array<[string, React.ReactNode]> = [
  ["translate(2, 454)", <LabirynthIcon />],
  ["translate(67, 454)", <ServerIcon />],
  ["translate(132, 454)", <ModemIcon />],
  ["translate(197, 454)", <CloudIcon />],
  ["translate(262, 454)", <CloudIcon />],
]
/* eslint-enable react/jsx-key */

function MobileClientEdges() {
  return (
    <>
      <path
        d="M154 157L154 85L219 85L219 48"
        stroke="url(#smallscreen_linear1)"
      />
      <path
        d="M154 157L154 84.9209L88 84.9209L88 48"
        stroke="url(#smallscreen_linear1)"
      />
      <path
        d="M154 107.855L154 157L155 48"
        stroke="url(#smallscreen_linear1)"
      />
      <path
        d="M154 157L154.002 85L284 85L284 48"
        stroke="url(#smallscreen_linear1)"
      />
      <path
        d="M154 158L154 136.031L154 85L24 84.8443L24 48"
        stroke="url(#smallscreen_linear1)"
        strokeWidth="2"
      />
    </>
  )
}

function MobileServerEdges() {
  return (
    <>
      <path
        d="M130.094 344L130.094 426L91.6745 426L91.6745 454"
        stroke="url(#smallscrean_linear2)"
      />
      <path
        d="M156.002 344L156.002 345.948L156.002 454"
        stroke="url(#smallscrean_linear2)"
      />
      <path
        d="M101.504 344L101.504 398.5L26.0075 398.5L26.0075 454"
        stroke="url(#smallscrean_linear2)"
      />
      <path
        d="M181.918 344L181.916 426L220.335 426L220.337 454"
        stroke="url(#smallscrean_linear2)"
      />
      <path
        d="M210.512 344L210.512 398L286.008 398L286.008 454"
        stroke="url(#smallscrean_linear2)"
      />
    </>
  )
}

function MobileSVGDefinitions() {
  return (
    <defs>
      <linearGradient
        id="smallscreen_linear1"
        x1="0.142323"
        y1="124.751"
        x2="0.142321"
        y2="-122.582"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          stopColor="hsl(var(--color-neu-100))"
          className="dark:[stop-color:hsl(var(--color-neu-50))]"
        />
        <stop
          offset="1"
          stopColor="hsl(var(--color-neu-600))"
          className="dark:[stop-color:hsl(var(--color-neu-100))]"
        />
      </linearGradient>
      <linearGradient
        id="smallscrean_linear2"
        x1="66.6927"
        y1="344"
        x2="66.6927"
        y2="399.436"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          stopColor="hsl(var(--color-neu-100))"
          className="dark:[stop-color:hsl(var(--color-neu-50))]"
        />
        <stop
          offset="1"
          stopColor="hsl(var(--color-neu-600))"
          className="dark:[stop-color:hsl(var(--color-neu-100))]"
        />
      </linearGradient>
    </defs>
  )
}

function MobileDiagram() {
  return (
    <svg
      width="310"
      height="450"
      viewBox="0 0 310 502"
      fill="none"
      preserveAspectRatio="xMidYMid"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto sm:hidden"
      aria-label="GraphQL allows you to build API Gateways to bring data from multiple sources to your clients in a single query"
    >
      <MobileClientEdges />
      <ClientBoxes boxes={mobileClientBoxes} />
      <MobileServerEdges />
      <ServerBoxes highlighted={[]} boxes={mobileServerBoxes} />
      <MobileSVGDefinitions />
    </svg>
  )
}
