"use client"

import { useEffect, useRef, useState } from "react"

import { meetups } from "@/components/meetups"

import {
  bootMeetupsMap,
  type MapHandle,
  type MapStats,
  type MarkerPoint,
  type SamplingQuality,
} from "./map/engine"

const LAND_MASK_URL = new URL("./map/land-mask.png", import.meta.url).toString()
const INITIAL_CELL = 14
const INITIAL_DOT = 12
const INITIAL_QUALITY: SamplingQuality = 4
const CELL_RANGE = { min: 6, max: 24 }
const DOT_RANGE = { min: 2, max: 14 }
const QUALITIES: SamplingQuality[] = [1, 4, 16]
const HUB_MEETUP_IDS = new Set(["paris"])

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
  const [stats, setStats] = useState<MapStats>({
    fps: 0,
    zoom: 1,
    cellSize: INITIAL_CELL,
    dotSize: INITIAL_DOT,
    quality: INITIAL_QUALITY,
  })
  const [status, setStatus] = useState<MapStatus>("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
          initialCellSize: INITIAL_CELL,
          initialDotSize: INITIAL_DOT,
          initialQuality: INITIAL_QUALITY,
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

  const disabled = status !== "ready"

  const updateQuality = (quality: SamplingQuality) => {
    if (disabled) return
    handleRef.current?.setQuality(quality)
  }

  const updateCell = (next: number) => {
    if (disabled) return
    handleRef.current?.setCellSize(next)
  }

  const updateDot = (next: number) => {
    if (disabled) return
    handleRef.current?.setDotSize(next)
  }

  const adjust = (value: number, delta: number, min: number, max: number) => {
    const next = clamp(value + delta, min, max)
    return next
  }

  return (
    <div className="my-6">
      <div className="relative border border-neu-200 bg-[#f5f4ed]">
        <canvas
          ref={canvasRef}
          aria-label="Interactive WebGL map of GraphQL meetups"
          className="block h-[28rem] w-full"
          style={{ imageRendering: "pixelated", touchAction: "none" }}
        />

        {status !== "ready" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#f5f4ed]/70 text-center text-sm text-neu-600">
            {status === "loading"
              ? "Booting WebGL map…"
              : `Unable to load the map${errorMessage ? ` (${errorMessage})` : ""}`}
          </div>
        )}

        <div className="pointer-events-none absolute left-4 top-4 flex max-w-sm flex-col gap-3 border border-neu-300 bg-white/85 p-3 text-[0.65rem] uppercase tracking-wide text-neu-600">
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
                  className={`border border-neu-300 px-2 py-1 text-[0.7rem] ${
                    stats.quality === quality
                      ? "bg-[#ffb5d8] text-[#7b0053]"
                      : "bg-white text-neu-600"
                  } ${disabled ? "opacity-60" : ""}`}
                >
                  {quality}x
                </button>
              ))}
            </div>
          </div>
          <div className="pointer-events-auto flex flex-col gap-1 text-[0.7rem] normal-case">
            <label className="flex items-center justify-between">
              <span>Cell</span>
              <span>{stats.cellSize.toFixed(0)} px</span>
            </label>
            <div className="flex justify-between gap-2">
              <button
                type="button"
                disabled={disabled}
                onClick={() =>
                  updateCell(
                    adjust(stats.cellSize, -1, CELL_RANGE.min, CELL_RANGE.max),
                  )
                }
                className="border border-neu-300 px-2 py-1 text-sm"
              >
                -
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() =>
                  updateCell(
                    adjust(stats.cellSize, 1, CELL_RANGE.min, CELL_RANGE.max),
                  )
                }
                className="border border-neu-300 px-2 py-1 text-sm"
              >
                +
              </button>
            </div>
          </div>
          <div className="pointer-events-auto flex flex-col gap-1 text-[0.7rem] normal-case">
            <label className="flex items-center justify-between">
              <span>Dot</span>
              <span>{stats.dotSize.toFixed(0)} px</span>
            </label>
            <div className="flex justify-between gap-2">
              <button
                type="button"
                disabled={disabled}
                onClick={() =>
                  updateDot(
                    adjust(
                      stats.dotSize,
                      -1,
                      DOT_RANGE.min,
                      Math.min(DOT_RANGE.max, stats.cellSize),
                    ),
                  )
                }
                className="border border-neu-300 px-2 py-1 text-sm"
              >
                -
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() =>
                  updateDot(
                    adjust(
                      stats.dotSize,
                      1,
                      DOT_RANGE.min,
                      Math.min(DOT_RANGE.max, stats.cellSize),
                    ),
                  )
                }
                className="border border-neu-300 px-2 py-1 text-sm"
              >
                +
              </button>
            </div>
          </div>
          <button
            type="button"
            disabled={disabled}
            className="pointer-events-auto border border-neu-400 bg-white px-2 py-1 text-[0.7rem] normal-case"
            onClick={() => handleRef.current?.resetView()}
          >
            Reset (R)
          </button>
        </div>

        <div className="pointer-events-none absolute bottom-4 left-4 text-[0.75rem] text-neu-600">
          Scroll to zoom, drag to pan, press R to reset
        </div>
      </div>
    </div>
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
