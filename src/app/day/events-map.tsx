"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react"
import { useTheme } from "next-themes"

import {
  bootMeetupsMap,
  type MapHandle,
  type MarkerPoint,
} from "@/app/(main)/community/events/map/engine"
import { MapSkeleton } from "@/app/(main)/community/events/map-skeleton"
import {
  asRgbString,
  MAP_COLORS,
  MapColors,
} from "@/app/(main)/community/events/map/map-colors"

const CELL_SIZE = 8
const SQUARE_SIZE = 6
const LAND_MASK_URL = new URL(
  "../(main)/community/events/map/land-mask.png",
  import.meta.url,
).toString()
const ASPECT_RATIO = 1.65

type ThemeVariant = keyof typeof MAP_COLORS

export interface EventMapItem {
  id: string
  city: string
  date: string
  href: string
  lon: number
  lat: number
}

const EVENTS: EventMapItem[] = [
  {
    id: "singapore",
    city: "Singapore",
    date: "Apr 14-15",
    href: "/day/2026/singapore",
    lon: 103.8198,
    lat: 1.3521,
  },
  {
    id: "nyc",
    city: "NYC",
    date: "May 13-14",
    href: "/day/2026/nyc",
    lon: -74.006,
    lat: 40.7128,
  },
  {
    id: "amsterdam",
    city: "Amsterdam",
    date: "Jun 9-10 [TBC]",
    href: "/day/2026/amsterdam",
    lon: 4.9041,
    lat: 52.3676,
  },
  {
    id: "melbourne",
    city: "Melbourne",
    date: "Oct 28-29",
    href: "/day/2026/melbourne",
    lon: 144.9631,
    lat: -37.8136,
  },
  {
    id: "paris",
    city: "Paris",
    date: "Dec 1-3",
    href: "/day/2026/paris",
    lon: 2.3522,
    lat: 48.8566,
  },
]

const markerPoints: MarkerPoint[] = EVENTS.map(e => ({
  id: e.id,
  lon: e.lon,
  lat: e.lat,
}))

type MapStatus = "loading" | "ready" | "error"

export function EventsMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const handleRef = useRef<MapHandle>()
  const { resolvedTheme } = useTheme()
  const [activeEventId, setActiveEventId] = useState<string | null>(null)
  const themeColors = useMemo(
    () => MAP_COLORS[resolvedTheme as ThemeVariant] || MAP_COLORS.light,
    [resolvedTheme],
  )
  const initialThemeRef = useRef<MapColors>(themeColors)

  const [status, setStatus] = useState<MapStatus>("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const tooltip = document.getElementById("events-map-tooltip")
    if (!tooltip) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    tooltip.style.setProperty("--x", `${x}px`)
    tooltip.style.setProperty("--y", `${y}px`)
  }

  const handlePointerLeave = () => {
    const tooltip = document.getElementById("events-map-tooltip")
    if (!tooltip) return
    tooltip.style.removeProperty("--x")
    tooltip.style.removeProperty("--y")
  }

  const activeEvent = useMemo(
    () => EVENTS.find(e => e.id === activeEventId),
    [activeEventId],
  )

  const handleMapClick = () => {
    if (activeEvent?.href) {
      window.location.href = activeEvent.href
    }
  }

  useEffect(() => {
    initialThemeRef.current = themeColors
  }, [themeColors])

  useEffect(() => {
    if (status !== "ready" || !handleRef.current) return
    handleRef.current.setActiveMarker(activeEventId)
  }, [status, activeEventId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const abortController = new AbortController()
    let engine: MapHandle | null = null
    let disposed = false

    const start = async () => {
      try {
        engine = await bootMeetupsMap({
          canvas,
          markers: markerPoints,
          maskUrl: LAND_MASK_URL,
          initialCellSize: CELL_SIZE,
          initialSquareSize: SQUARE_SIZE,
          aspectRatio: ASPECT_RATIO,
          theme: initialThemeRef.current,
          signal: abortController.signal,
          onActiveMarkerChange: setActiveEventId,
        })
        if (disposed) {
          engine.dispose()
          return
        }
        handleRef.current = engine
        setStatus("ready")
        setErrorMessage(null)
      } catch (error) {
        if (abortController.signal.aborted) return
        console.error(error)
        setStatus("error")
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong while rendering the map.",
        )
      }
    }

    void start()

    return () => {
      disposed = true
      abortController.abort()
      handleRef.current = undefined
      engine?.dispose()
    }
  }, [])

  useEffect(() => {
    if (!handleRef.current) return
    handleRef.current.setThemeColors(themeColors)
  }, [themeColors])

  return (
    <div
      id="events-map"
      onMouseOut={() => {
        setActiveEventId(null)
      }}
      className="my-6 flex flex-row-reverse divide-neu-200 border border-neu-200 bg-[--sea] [--sea:--sea-light] dark:divide-neu-50 dark:border-neu-50 dark:[--sea:--sea-dark] max-md:flex-col max-md:divide-y md:h-[592px]"
      style={
        {
          "--sea-dark": asRgbString(MAP_COLORS.dark.sea),
          "--sea-light": asRgbString(MAP_COLORS.light.sea),
          "--land-dark": asRgbString(MAP_COLORS.dark.land),
          "--land-light": asRgbString(MAP_COLORS.light.land),
        } as React.CSSProperties
      }
    >
      <div
        className="group/map relative grow border-neu-200 bg-[--sea] dark:border-neu-50 dark:bg-[--sea] md:border-l"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleMapClick}
      >
        <canvas
          ref={canvasRef}
          aria-describedby="events-map-tooltip"
          aria-label="Interactive map of GraphQL Day events"
          className="block h-80 w-full animate-fade-in transition-opacity duration-150 ease-linear md:h-full"
          style={{
            imageRendering: "pixelated",
            touchAction: "none",
            opacity: status === "ready" ? 1 : 0,
          }}
        />

        <EventMapTooltip
          id="events-map-tooltip"
          activeEventId={activeEventId}
        />

        <InfoTip />

        <MapSkeleton className={status === "loading" ? "" : "!opacity-0"} />

        {status === "error" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-sm text-neu-600">
            Unable to load the map{errorMessage ? ` (${errorMessage})` : ""}
          </div>
        )}
      </div>
      <EventsList
        activeEventId={activeEventId}
        onActiveEventChange={setActiveEventId}
        className="shrink-0 md:max-h-full lg:w-[240px]"
      />
    </div>
  )
}

function EventsList({
  className,
  activeEventId,
  onActiveEventChange,
}: {
  className?: string
  activeEventId?: string | null
  onActiveEventChange?: (id: string | null) => void
}) {
  return (
    <ul
      className={`nextra-scrollbar overflow-y-auto scrollview-fade-y-16 scrollview-fade md:h-full ${className || ""}`}
    >
      {EVENTS.map(event => {
        const isActive = event.id === activeEventId
        return (
          <li key={event.id}>
            <a
              href={event.href}
              aria-current={isActive ? "true" : undefined}
              title={`${event.city} — ${event.date}`}
              className={`gql-focus-visible group/li flex items-center justify-between gap-3 border-b border-neu-300 px-3 py-2 text-sm text-neu-800 transition-colors last:border-0 hover:bg-neu-200 hover:duration-0 dark:hover:bg-neu-900/5 ${isActive ? "[ul:not(:hover)_&]:bg-neu-200 [ul:not(:hover)_&]:dark:bg-neu-900/5" : ""}`}
              onMouseOver={() => onActiveEventChange?.(event.id)}
              onFocus={() => onActiveEventChange?.(event.id)}
            >
              <span className="typography-body-md truncate">{event.city}</span>
              <span className="text-xs text-neu-600">{event.date}</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function EventMapTooltip({
  id,
  activeEventId,
}: {
  id: string
  activeEventId: string | null
}) {
  const name = activeEventId && EVENTS.find(e => e.id === activeEventId)?.city
  return (
    <span
      id={id}
      role="tooltip"
      className="pointer-events-none absolute left-0 top-0 z-10 hidden min-w-0 whitespace-nowrap border border-neu-200/40 bg-neu-0/40 px-2 py-[3px] text-xs text-neu-900 shadow-sm backdrop-blur-sm group-hover/map:flex"
      style={{
        transform: `translate3d(calc(var(--x) - 50%), calc(var(--y) - 50% - 22px), 0)`,
        visibility: activeEventId ? "visible" : "hidden",
      }}
    >
      {name}
    </span>
  )
}

function InfoTip() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 w-fit translate-y-0.5 px-1 py-0.5 text-[11px] text-neu-700/90 opacity-0 blur-[0.5px] backdrop-blur-sm transition duration-200 before:inset-0 before:bg-[--sea] before:opacity-30 group-hover/map:translate-y-0 group-hover/map:opacity-100 group-hover/map:blur-0 hover-none:hidden">
      Pinch or ctrl+scroll to zoom
    </div>
  )
}
