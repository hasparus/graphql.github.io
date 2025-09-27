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

interface OklchColor {
  l: number
  c: number
  h: number
}

interface GradientStop {
  offset: number
  color: OklchColor
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
    normalizeHue(baseHue - 18 + (random() - 0.5) * 10),
    normalizeHue(baseHue + 8 + (random() - 0.5) * 12),
    normalizeHue(baseHue + 26 + (random() - 0.5) * 14),
  ]

  const lightness = [
    clamp(0.68, 0.8, 0.74 + (random() - 0.5) * 0.06),
    clamp(0.56, 0.72, 0.64 + (random() - 0.5) * 0.06),
    clamp(0.7, 0.84, 0.78 + (random() - 0.5) * 0.06),
  ]

  const chromas = [
    clamp(0.12, 0.26, 0.18 + (random() - 0.5) * 0.08),
    clamp(0.18, 0.32, 0.24 + (random() - 0.5) * 0.1),
    clamp(0.12, 0.24, 0.18 + (random() - 0.5) * 0.08),
  ]

  return stopOffsets.map((offset, index) => ({
    offset,
    color: {
      l: lightness[index],
      c: chromas[index],
      h: hues[index],
    },
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

  const oklch = evaluateGradient(gradient.stops, t)
  return oklchToSrgb(oklch)
}

function evaluateGradient(stops: GradientStop[], t: number): OklchColor {
  if (stops.length === 0) {
    return { l: 0.72, c: 0.18, h: 0 }
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
      return mixOklch(previous.color, stop.color, amount)
    }
  }

  return stops[stops.length - 1].color
}

function toCssColor([r, g, b]: RgbColor) {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
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

function mixOklch(a: OklchColor, b: OklchColor, amount: number): OklchColor {
  const hueStep = shortestHueDistance(a.h, b.h)
  return {
    l: a.l + (b.l - a.l) * amount,
    c: a.c + (b.c - a.c) * amount,
    h: normalizeHue(a.h + hueStep * amount),
  }
}

function shortestHueDistance(start: number, end: number) {
  const startNorm = normalizeHue(start)
  const endNorm = normalizeHue(end)
  let diff = endNorm - startNorm
  if (diff > 180) {
    diff -= 360
  } else if (diff < -180) {
    diff += 360
  }
  return diff
}

function oklchToSrgb({ l, c, h }: OklchColor): RgbColor {
  const hueRad = (h / 180) * Math.PI
  const a = Math.cos(hueRad) * c
  const b = Math.sin(hueRad) * c

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b
  const s_ = l - 0.0894841775 * a - 1.291485548 * b

  const l3 = l_ * l_ * l_
  const m3 = m_ * m_ * m_
  const s3 = s_ * s_ * s_

  const rLinear = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3
  const gLinear = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3
  const bLinear = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3

  return [
    linearToSrgb(rLinear),
    linearToSrgb(gLinear),
    linearToSrgb(bLinear),
  ]
}

function linearToSrgb(value: number) {
  const clamped = clamp(0, 1, value)
  if (clamped <= 0.0031308) {
    return clamped * 12.92 * 255
  }
  return (1.055 * Math.pow(clamped, 1 / 2.4) - 0.055) * 255
}
