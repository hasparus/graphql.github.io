"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useTheme } from "next-themes"

import { meetups } from "@/components/meetups"

import {
  bootMeetupsMap,
  type MapHandle,
  type MarkerPoint,
  type SamplingQuality,
} from "./map/engine"
import { MeetupsList } from "./meetups-list"
import { MAP_COLORS, MapColors } from "./map/map-colors"

const CELL_SIZE = 8
const SQUARE_SIZE = 6
const INITIAL_QUALITY: SamplingQuality = 4
const HUB_MEETUP_IDS = new Set(["paris"])
const LAND_MASK_URL = new URL("./map/land-mask.png", import.meta.url).toString()
const ASPECT_RATIO = 1.65

type ThemeVariant = keyof typeof MAP_COLORS

const markerPoints: MarkerPoint[] = meetups.map(({ node }) => ({
  id: node.id,
  lon: node.longitude,
  lat: node.latitude,
  isHub: HUB_MEETUP_IDS.has(node.id),
}))

type MapStatus = "loading" | "ready" | "error"

export function MeetupsMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const handleRef = useRef<MapHandle>()
  const { resolvedTheme } = useTheme()
  const [activeMeetupId, setActiveMeetupId] = useState<string | null>(null)
  const themeColors = useMemo(
    () => MAP_COLORS[resolvedTheme as ThemeVariant] || MAP_COLORS.light,
    [resolvedTheme],
  )
  const initialThemeRef = useRef<MapColors>(themeColors)

  const [status, setStatus] = useState<MapStatus>("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    initialThemeRef.current = themeColors
  }, [themeColors])

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
          initialQuality: INITIAL_QUALITY,
          aspectRatio: ASPECT_RATIO,
          theme: initialThemeRef.current,
          signal: abortController.signal,
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
      className="group my-6 flex flex-row-reverse divide-neu-200 overflow-hidden border border-neu-200 bg-[--sea-light] dark:divide-neu-50 dark:border-neu-50 dark:bg-[--sea-dark] max-md:flex-col max-md:divide-y md:h-[592px]"
      style={
        {
          "--sea-dark": `rgb(${MAP_COLORS.dark.sea.map(c => Math.round(c * 255)).join(", ")})`,
          "--sea-light": `rgb(${MAP_COLORS.light.sea.map(c => Math.round(c * 255)).join(", ")})`,
        } as React.CSSProperties
      }
    >
      <div className="relative grow bg-[--sea] [--sea:--sea-light] dark:[--sea:--sea-dark]">
        <canvas
          ref={canvasRef}
          aria-label="Interactive WebGL map of GraphQL meetups"
          className="block h-80 w-full md:h-full"
          style={{ imageRendering: "pixelated", touchAction: "none" }}
        />

        <div className="pointer-events-none absolute bottom-0 left-0 w-fit translate-y-0.5 px-1 py-0.5 text-[11px] text-neu-700/90 opacity-0 blur-[0.5px] backdrop-blur-sm transition duration-200 before:inset-0 before:bg-[--sea] before:opacity-30 group-hover:translate-y-0 group-hover:opacity-100 group-hover:blur-0 hover-none:hidden">
          Pinch or ctrl+scroll to zoom
        </div>

        {status !== "ready" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-sm text-neu-600">
            {status === "loading"
              ? "Booting WebGL map…"
              : `Unable to load the map${errorMessage ? ` (${errorMessage})` : ""}`}
          </div>
        )}
      </div>
      <MeetupsList
        activeMeetupId={activeMeetupId}
        onActiveMeetupChange={setActiveMeetupId}
        className="shrink-0 border-neu-200 dark:border-neu-50 md:max-h-full md:border-r lg:w-[240px]"
      />
    </div>
  )
}
