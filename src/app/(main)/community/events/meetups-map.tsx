"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useTheme } from "next-themes"

import { meetups } from "@/components/meetups"

import {
  bootMeetupsMap,
  type MapHandle,
  type MapStats,
  type MarkerPoint,
  type SamplingQuality,
  type MapColors,
} from "./map/engine"

const CELL_SIZE = 16
const SQUARE_SIZE = 12
const INITIAL_QUALITY: SamplingQuality = 4
const QUALITIES: SamplingQuality[] = [1, 4, 16]
const HUB_MEETUP_IDS = new Set(["paris"])
const LAND_MASK_URL = new URL("./map/land-mask.png", import.meta.url).toString()
const ASPECT_RATIO = 1.65

const MAP_THEMES = {
  light: {
    sea: [0.9804, 0.9882, 0.9569],
    land: [0.8627, 0.8706, 0.8275],
  },
  dark: {
    sea: [0.0549, 0.0588, 0.0431],
    land: [0.1647, 0.1804, 0.1373],
  },
} satisfies Record<string, MapColors>

type ThemeVariant = keyof typeof MAP_THEMES

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
  const themeColors = useMemo(
    () => getMapColors(resolvedTheme),
    [resolvedTheme],
  )
  const initialThemeRef = useRef<MapColors>(themeColors)
  const [stats, setStats] = useState<MapStats>({
    fps: 0,
    zoom: 1,
    cellSize: CELL_SIZE,
    squareSize: SQUARE_SIZE,
    quality: INITIAL_QUALITY,
  })
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
          theme: initialThemeRef.current,
          onStatsChange: next => setStats(next),
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

  const disabled = status !== "ready"

  const updateQuality = (quality: SamplingQuality) => {
    if (disabled) return
    handleRef.current?.setQuality(quality)
  }

  return (
    <div className="my-6">
      <div className="relative border border-neu-200 bg-[#f5f4ed] dark:border-neu-700 dark:bg-[#0b0d10]">
        <canvas
          ref={canvasRef}
          aria-label="Interactive WebGL map of GraphQL meetups"
          className="block h-[28rem] w-full"
          style={{ imageRendering: "pixelated", touchAction: "none" }}
        />

        {status !== "ready" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#f5f4ed]/70 text-center text-sm text-neu-600 dark:bg-[#0b0d10]/70 dark:text-neu-50">
            {status === "loading"
              ? "Booting WebGL map…"
              : `Unable to load the map${errorMessage ? ` (${errorMessage})` : ""}`}
          </div>
        )}

        <div className="pointer-events-none absolute left-4 top-4 flex max-w-sm flex-col gap-3 border border-neu-300 bg-white/85 p-3 text-[0.65rem] uppercase tracking-wide text-neu-600 dark:border-neu-700 dark:bg-[#14181f]/85 dark:text-neu-100">
          <div className="flex items-center justify-between gap-6">
            <span>FPS</span>
            <span>{stats.fps.toFixed(0)}</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span>Zoom</span>
            <span>{stats.zoom.toFixed(2)}×</span>
          </div>
          <div className="flex flex-col gap-2 text-[0.7rem] normal-case">
            <span className="text-[0.65rem] uppercase tracking-wide">
              Quality
            </span>
            <div className="pointer-events-auto flex gap-1">
              {QUALITIES.map(quality => (
                <button
                  key={quality}
                  type="button"
                  disabled={disabled}
                  onClick={() => updateQuality(quality)}
                  className={`border border-neu-300 px-2 py-1 text-[0.7rem] dark:border-neu-700 ${
                    stats.quality === quality
                      ? "bg-[#ffb5d8] text-[#7b0053]"
                      : "bg-white text-neu-600 dark:bg-[#1f2430] dark:text-neu-50"
                  } ${disabled ? "opacity-60" : ""}`}
                >
                  {quality}x
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            disabled={disabled}
            className="pointer-events-auto border border-neu-400 bg-white px-2 py-1 text-[0.7rem] normal-case dark:border-neu-700 dark:bg-[#1f2430] dark:text-neu-50"
            onClick={() => handleRef.current?.resetView()}
          >
            Reset (R)
          </button>
        </div>

        <div className="pointer-events-none absolute bottom-4 left-4 text-[0.75rem] text-neu-600 dark:text-neu-100">
          Scroll to zoom, drag to pan, press R to reset
        </div>
      </div>
    </div>
  )
}

function getMapColors(theme?: string | null): MapColors {
  if (theme && theme in MAP_THEMES) {
    return MAP_THEMES[theme as ThemeVariant]
  }
  return MAP_THEMES.light
}
