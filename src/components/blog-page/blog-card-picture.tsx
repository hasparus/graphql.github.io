import { clsx } from "clsx"
import { type ReactNode, useEffect, useRef } from "react"

const PIXEL_SIZE = 16
const MAX_DPR = 2
const UINT32_MAX = 0xffffffff

interface BlogCardPictureProps {
  seed: string
  children?: ReactNode
  className?: string
}

type RgbColor = [number, number, number]

interface GradientStop {
  offset: number
  color: RgbColor
}

interface PreparedGradient {
  cos: number
  sin: number
  minProjection: number
  invProjectionRange: number
  stops: GradientStop[]
}

// TODO: Animate nicer on load
// TODO: Update seeding: The closer the post date the more different the gradient should be?
// TODO: Think: Should the category colors actually be connected to the gradient, so the tag doesn't ever look jarring?
export function BlogCardPicture({
  seed,
  children,
  className,
}: BlogCardPictureProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) {
      return
    }

    let frame = 0

    const draw = () => {
      const rect = container.getBoundingClientRect()
      const width = Math.max(0, Math.round(rect.width))
      const height = Math.max(0, Math.round(rect.height))

      if (width === 0 || height === 0) {
        return
      }

      const columns = Math.max(1, Math.ceil(width / PIXEL_SIZE))
      const rows = Math.max(1, Math.ceil(height / PIXEL_SIZE))
      const dpr = Math.min(
        typeof window === "undefined" ? 1 : (window.devicePixelRatio ?? 1),
        MAX_DPR,
      )
      const canvasWidth = Math.round(width * dpr)
      const canvasHeight = Math.round(height * dpr)

      if (canvas.width !== canvasWidth) {
        canvas.width = canvasWidth
      }
      if (canvas.height !== canvasHeight) {
        canvas.height = canvasHeight
      }

      const displayWidth = `${width}px`
      const displayHeight = `${height}px`
      if (canvas.style.width !== displayWidth) {
        canvas.style.width = displayWidth
      }
      if (canvas.style.height !== displayHeight) {
        canvas.style.height = displayHeight
      }

      const context = canvas.getContext("2d")
      if (!context) {
        return
      }

      context.setTransform(1, 0, 0, 1, 0, 0)
      context.scale(dpr, dpr)
      context.clearRect(0, 0, width, height)
      context.imageSmoothingEnabled = false

      const random = createSeededRandom(seed)
      const angle = random() * Math.PI * 2
      const gradientStops = buildGradientStops(random)
      const gradient = prepareGradient({
        angle,
        stops: gradientStops,
        columns,
        rows,
      })
      const jitterPrefix = `${seed}|`

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const color = sampleGradientColor({
            gradient,
            column,
            row,
            jitterPrefix,
          })

          const x = column * PIXEL_SIZE
          const y = row * PIXEL_SIZE
          const cellWidth = Math.min(PIXEL_SIZE, width - x)
          const cellHeight = Math.min(PIXEL_SIZE, height - y)

          context.fillStyle = toCssColor(color)
          context.fillRect(x, y, cellWidth, cellHeight)
        }
      }
    }

    const drawWithAnimationFrame = () => {
      cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(draw)
    }

    drawWithAnimationFrame()

    const handleResize = () => {
      drawWithAnimationFrame()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", handleResize)
    }
  }, [seed])

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative isolate overflow-hidden bg-neu-50 dark:opacity-90",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full"
      />
      {children ? <div className="relative z-10 p-4">{children}</div> : null}
    </div>
  )
}

function createSeededRandom(seed: string) {
  let state = hashString(seed) || 1
  return () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    state >>>= 0
    return state / UINT32_MAX
  }
}

function prepareGradient({
  angle,
  stops,
  columns,
  rows,
}: {
  angle: number
  stops: GradientStop[]
  columns: number
  rows: number
}): PreparedGradient {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  const corners: Array<[number, number]> = [
    [0, 0],
    [columns, 0],
    [0, rows],
    [columns, rows],
  ]

  let minProjection = Infinity
  let maxProjection = -Infinity

  for (const [x, y] of corners) {
    const projection = x * cos + y * sin
    if (projection < minProjection) {
      minProjection = projection
    }
    if (projection > maxProjection) {
      maxProjection = projection
    }
  }

  const range = Math.max(maxProjection - minProjection, 1e-6)

  return {
    cos,
    sin,
    minProjection,
    invProjectionRange: 1 / range,
    stops,
  }
}

function buildGradientStops(random: () => number): GradientStop[] {
  const baseHue = random() * 360
  const stopOffsets = [0, clamp(0.25, 0.75, 0.44 + (random() - 0.5) * 0.22), 1]

  const hues = [
    normalizeHue(baseHue - 14 + (random() - 0.5) * 10),
    normalizeHue(baseHue + 10 + (random() - 0.5) * 14),
    normalizeHue(baseHue + 28 + (random() - 0.5) * 16),
  ]

  const saturations = [
    clamp(0.45, 0.65, 0.54 + (random() - 0.5) * 0.08),
    clamp(0.48, 0.7, 0.58 + (random() - 0.5) * 0.1),
    clamp(0.42, 0.62, 0.5 + (random() - 0.5) * 0.08),
  ]

  const lightness = [
    clamp(0.58, 0.75, 0.68 + (random() - 0.5) * 0.07),
    clamp(0.52, 0.7, 0.6 + (random() - 0.5) * 0.07),
    clamp(0.6, 0.78, 0.7 + (random() - 0.5) * 0.07),
  ]

  return stopOffsets.map((offset, index) => ({
    offset,
    color: hslToRgb(hues[index], saturations[index], lightness[index]),
  }))
}

function sampleGradientColor({
  gradient,
  column,
  row,
  jitterPrefix,
}: {
  gradient: PreparedGradient
  column: number
  row: number
  jitterPrefix: string
}): RgbColor {
  const x = column + 0.5
  const y = row + 0.5

  const projection = x * gradient.cos + y * gradient.sin
  const baseT =
    (projection - gradient.minProjection) * gradient.invProjectionRange
  const noise = hashString(`${jitterPrefix}${column}:${row}`) / UINT32_MAX
  const t = clamp(0, 1, baseT + (noise - 0.5) * 0.06)

  return evaluateGradient(gradient.stops, t)
}

function evaluateGradient(stops: GradientStop[], t: number): RgbColor {
  if (stops.length === 0) {
    return [200, 200, 200]
  }

  if (t <= stops[0].offset) {
    return stops[0].color
  }

  for (let index = 1; index < stops.length; index += 1) {
    const stop = stops[index]
    const previous = stops[index - 1]
    if (t <= stop.offset) {
      const span = Math.max(stop.offset - previous.offset, 1e-6)
      const amount = (t - previous.offset) / span
      return mixColors(previous.color, stop.color, amount)
    }
  }

  return stops[stops.length - 1].color
}

function mixColors(
  [r1, g1, b1]: RgbColor,
  [r2, g2, b2]: RgbColor,
  amount: number,
): RgbColor {
  return [
    r1 + (r2 - r1) * amount,
    g1 + (g2 - g1) * amount,
    b1 + (b2 - b1) * amount,
  ]
}

function toCssColor([r, g, b]: RgbColor) {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
}

function hslToRgb(h: number, s: number, l: number): RgbColor {
  const chroma = (1 - Math.abs(2 * l - 1)) * s
  const huePrime = h / 60
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1))

  let r = 0
  let g = 0
  let b = 0

  if (huePrime >= 0 && huePrime < 1) {
    r = chroma
    g = x
  } else if (huePrime >= 1 && huePrime < 2) {
    r = x
    g = chroma
  } else if (huePrime >= 2 && huePrime < 3) {
    g = chroma
    b = x
  } else if (huePrime >= 3 && huePrime < 4) {
    g = x
    b = chroma
  } else if (huePrime >= 4 && huePrime < 5) {
    r = x
    b = chroma
  } else if (huePrime >= 5 && huePrime < 6) {
    r = chroma
    b = x
  }

  const m = l - chroma / 2

  return [(r + m) * 255, (g + m) * 255, (b + m) * 255]
}

function normalizeHue(hue: number) {
  return ((hue % 360) + 360) % 360
}

function clamp(min: number, max: number, value: number) {
  return Math.min(max, Math.max(min, value))
}

function hashString(value: string) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}
