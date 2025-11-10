import { createProgram, initGL, loadLandMaskTexture } from "./gl-utils"
import { lonLatToUV, type UV } from "./projection"
import { dotsFrag, fullscreenVert, markersFrag, markersVert } from "./shaders"

type ColorVec = [r: number, g: number, b: number]

export type MapColors = {
  sea: ColorVec
  land: ColorVec
}

export type SamplingQuality = 1 | 4 | 16

export type MarkerPoint = {
  id: string
  lon: number
  lat: number
  isHub?: boolean
}

export type MapStats = {
  fps: number
  zoom: number
  cellSize: number
  squareSize: number
  quality: SamplingQuality
}

export type MapHandle = {
  dispose(): void
  setQuality(value: SamplingQuality): void
  setCellSize(value: number): void
  setSquareSize(value: number): void
  setThemeColors(colors: MapColors): void
  resetView(): void
}

export type BootOptions = {
  canvas: HTMLCanvasElement
  markers: MarkerPoint[]
  maskUrl: string
  initialQuality: SamplingQuality
  initialCellSize: number
  initialSquareSize: number
  aspectRatio: number
  theme: MapColors
  onStatsChange?: (stats: MapStats) => void
  signal?: AbortSignal
}

const MIN_ZOOM = 1
const MAX_ZOOM = 8
const MIN_CELL = 6
const MAX_CELL = 24
const MIN_SQUARE = 2
const MAX_SQUARE = 14
const MARKER_SIZE = 6
const HUB_HALO_SIZE = 18
const HUB_HALO_ALPHA = 0.35
const MARKER_COLOR: [number, number, number, number] = [1, 0.31, 0.7, 1]
const HALO_COLOR: [number, number, number, number] = [
  1,
  0.31,
  0.7,
  HUB_HALO_ALPHA,
]
const GOOGLE_MAPS_IDLE_CURSOR =
  'url("https://maps.gstatic.com/mapfiles/openhand_8_8.cur"), default'
const GOOGLE_MAPS_DRAG_CURSOR =
  'url("https://maps.gstatic.com/mapfiles/closedhand_8_8.cur"), move'
/**
 * Per-frame damping factor (scaled by dt / (1/60s)).
 * Decrease value to increase damping.
 */
const INERTIA_DAMPING = 0.87
/** Reference frame time in milliseconds for the damping exponent. */
const INERTIA_BASE_DT = 1000 / 60
/** Velocities below this normalized threshold snap directly to zero. */
const INERTIA_EPS = 1e-5

export async function bootMeetupsMap(options: BootOptions): Promise<MapHandle> {
  const gl = initGL(options.canvas)
  const dotsProgram = createProgram(gl, fullscreenVert, dotsFrag)
  const markersProgram = createProgram(gl, markersVert, markersFrag)
  let landTexture: WebGLTexture | null = null
  try {
    landTexture = await loadLandMaskTexture(gl, options.maskUrl, options.signal)
    console.assert(
      gl.getError() === gl.NO_ERROR,
      "WebGL init error",
      gl.getError(),
    )
    return new MapEngine({
      ...options,
      gl,
      dotsProgram,
      markersProgram,
      landTexture,
    })
  } catch (error) {
    gl.deleteProgram(dotsProgram)
    gl.deleteProgram(markersProgram)
    if (landTexture) gl.deleteTexture(landTexture)
    throw error
  }
}

type InternalOptions = BootOptions & {
  gl: WebGL2RenderingContext
  dotsProgram: WebGLProgram
  markersProgram: WebGLProgram
  landTexture: WebGLTexture
}

type MarkerInstance = {
  uv: UV
  size: number
  color: [number, number, number, number]
}

class MapEngine implements MapHandle {
  private gl: WebGL2RenderingContext
  private canvas: HTMLCanvasElement
  private dotsProgram: WebGLProgram
  private markersProgram: WebGLProgram
  private landTexture: WebGLTexture
  private quality: SamplingQuality
  private cellSize: number
  private squareSize: number
  private aspectRatio: number
  private zoom = 1
  private pan = new Float32Array([0, 0])
  private target = new Float32Array([0.5, 0.5])
  private velocity = new Float32Array([0, 0])
  private seaColor: Float32Array
  private landColor: Float32Array
  private readonly markerInstances: MarkerInstance[]
  private readonly centerBuffer: WebGLBuffer
  private readonly sizeBuffer: WebGLBuffer
  private readonly colorBuffer: WebGLBuffer
  private readonly markerVAO: WebGLVertexArrayObject
  private readonly fullscreenVAO: WebGLVertexArrayObject
  private readonly centerData: Float32Array
  private readonly sizeScratch: Float32Array
  private readonly colorScratch: Float32Array
  private readonly instanceCapacity: number
  private activeInstances = 0
  private readonly resizeObserver: ResizeObserver
  private readonly stats: MapStats
  private readonly hudThrottleMs = 120
  private lastHudTime = 0
  private rafHandle = 0
  private fps = 60
  private lastFrameTime = performance.now()
  private readonly pointer = {
    active: false,
    id: 0,
    startX: 0,
    startY: 0,
    targetAtStart: new Float32Array([0, 0]),
    lastMoveTime: 0,
  }
  private destroyed = false

  constructor(options: InternalOptions) {
    this.gl = options.gl
    this.canvas = options.canvas
    this.dotsProgram = options.dotsProgram
    this.markersProgram = options.markersProgram
    this.landTexture = options.landTexture
    this.aspectRatio = options.aspectRatio
    this.quality = options.initialQuality
    this.cellSize = clamp(options.initialCellSize, MIN_CELL, MAX_CELL)
    this.squareSize = clamp(
      options.initialSquareSize,
      MIN_SQUARE,
      Math.min(MAX_SQUARE, this.cellSize),
    )
    this.onStatsChange = options.onStatsChange
    this.stats = {
      fps: 0,
      zoom: this.zoom,
      cellSize: this.cellSize,
      squareSize: this.squareSize,
      quality: this.quality,
    }

    this.seaColor = new Float32Array(options.theme.sea)
    this.landColor = new Float32Array(options.theme.land)

    this.markerInstances = this.createMarkerInstances(options.markers)

    this.instanceCapacity = this.markerInstances.length * 3
    this.centerData = new Float32Array(this.instanceCapacity * 2)
    this.sizeScratch = new Float32Array(this.instanceCapacity)
    this.colorScratch = new Float32Array(this.instanceCapacity * 4)

    const gl = this.gl
    this.fullscreenVAO = gl.createVertexArray() as WebGLVertexArrayObject

    this.markerVAO = gl.createVertexArray() as WebGLVertexArrayObject
    this.centerBuffer = gl.createBuffer() as WebGLBuffer
    this.sizeBuffer = gl.createBuffer() as WebGLBuffer
    this.colorBuffer = gl.createBuffer() as WebGLBuffer

    gl.bindVertexArray(this.markerVAO)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.centerBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.centerData.byteLength, gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.vertexAttribDivisor(0, 1)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.sizeBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.sizeScratch.byteLength, gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(1)
    gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 0, 0)
    gl.vertexAttribDivisor(1, 1)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      this.colorScratch.byteLength,
      gl.DYNAMIC_DRAW,
    )
    gl.enableVertexAttribArray(2)
    gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 0, 0)
    gl.vertexAttribDivisor(2, 1)

    gl.bindVertexArray(null)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    this.resizeObserver = new ResizeObserver(() => this.resizeCanvas())
    this.resizeObserver.observe(this.canvas)
    this.resizeCanvas()
    this.updatePanFromTarget()
    this.attachEvents()
    this.loop()
  }

  dispose() {
    if (this.destroyed) return
    this.destroyed = true
    cancelAnimationFrame(this.rafHandle)
    this.resizeObserver.disconnect()
    this.detachEvents()
    const gl = this.gl
    gl.deleteProgram(this.dotsProgram)
    gl.deleteProgram(this.markersProgram)
    gl.deleteTexture(this.landTexture)
    gl.deleteBuffer(this.centerBuffer)
    gl.deleteBuffer(this.sizeBuffer)
    gl.deleteBuffer(this.colorBuffer)
    gl.deleteVertexArray(this.markerVAO)
    gl.deleteVertexArray(this.fullscreenVAO)
  }

  setQuality(value: SamplingQuality) {
    if (value === this.quality) return
    this.quality = value
  }

  setCellSize(value: number) {
    const next = clamp(value, MIN_CELL, MAX_CELL)
    if (next === this.cellSize) return
    this.cellSize = next
    if (this.squareSize > this.cellSize) {
      this.squareSize = this.cellSize
    }
  }

  setSquareSize(value: number) {
    const next = clamp(value, MIN_SQUARE, Math.min(MAX_SQUARE, this.cellSize))
    if (next === this.squareSize) return
    this.squareSize = next
  }

  setThemeColors(colors: MapColors) {
    this.seaColor.set(colors.sea)
    this.landColor.set(colors.land)
  }

  private getWorldDimensions() {
    const width = this.canvas.width || 1
    const height = this.canvas.height || 1
    const worldHeight = Math.min(width / this.aspectRatio, height)
    const worldWidth = worldHeight * this.aspectRatio
    return { width, height, worldWidth, worldHeight }
  }

  resetView() {
    this.zoom = 1
    this.target[0] = 0.5
    this.target[1] = 0.5
    this.velocity[0] = 0
    this.velocity[1] = 0
    this.updatePanFromTarget()
  }

  private createMarkerInstances(markers: MarkerPoint[]) {
    const instances: MarkerInstance[] = []
    for (const marker of markers) {
      const uv = lonLatToUV(marker.lon, marker.lat)
      if (marker.isHub) {
        instances.push({ uv, size: HUB_HALO_SIZE, color: HALO_COLOR })
      }
      instances.push({ uv, size: MARKER_SIZE, color: MARKER_COLOR })
    }
    return instances
  }

  private attachEvents() {
    this.canvas.style.cursor = GOOGLE_MAPS_IDLE_CURSOR
    this.canvas.addEventListener("pointerdown", this.handlePointerDown)
    this.canvas.addEventListener("pointermove", this.handlePointerMove)
    this.canvas.addEventListener("pointerup", this.handlePointerUp)
    this.canvas.addEventListener("pointerleave", this.handlePointerUp)
    this.canvas.addEventListener("pointercancel", this.handlePointerUp)
    this.canvas.addEventListener("wheel", this.handleWheel, { passive: false })
    window.addEventListener("keydown", this.handleKeyDown)
  }

  private detachEvents() {
    this.canvas.removeEventListener("pointerdown", this.handlePointerDown)
    this.canvas.removeEventListener("pointermove", this.handlePointerMove)
    this.canvas.removeEventListener("pointerup", this.handlePointerUp)
    this.canvas.removeEventListener("pointerleave", this.handlePointerUp)
    this.canvas.removeEventListener("pointercancel", this.handlePointerUp)
    this.canvas.removeEventListener("wheel", this.handleWheel)
    window.removeEventListener("keydown", this.handleKeyDown)
  }

  private handlePointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return
    this.pointer.active = true
    this.pointer.id = event.pointerId
    this.pointer.startX = event.clientX
    this.pointer.startY = event.clientY
    this.pointer.targetAtStart[0] = this.target[0]
    this.pointer.targetAtStart[1] = this.target[1]
    this.pointer.lastMoveTime = performance.now()
    this.velocity[0] = 0
    this.velocity[1] = 0
    this.canvas.setPointerCapture(event.pointerId)
    this.canvas.style.cursor = GOOGLE_MAPS_DRAG_CURSOR
  }

  private handlePointerMove = (event: PointerEvent) => {
    if (!this.pointer.active || event.pointerId !== this.pointer.id) return
    const scale = getDevicePixelRatio()
    const dx = (event.clientX - this.pointer.startX) * scale
    const dy = (event.clientY - this.pointer.startY) * scale
    const { worldWidth, worldHeight } = this.getWorldDimensions()
    const invWidth = worldWidth > 0 ? 1 / (worldWidth * this.zoom) : 0
    const invHeight = worldHeight > 0 ? 1 / (worldHeight * this.zoom) : 0
    const prevX = this.target[0]
    const prevY = this.target[1]
    const nextX = this.pointer.targetAtStart[0] - dx * invWidth
    const nextY = this.pointer.targetAtStart[1] + dy * invHeight
    this.target[0] = wrap01(nextX)
    this.target[1] = clamp01(nextY)
    this.updatePanFromTarget()

    const now = performance.now()
    const last = this.pointer.lastMoveTime || now
    const dt = Math.max(now - last, 1)
    this.pointer.lastMoveTime = now
    const invDt = 1 / dt
    this.velocity[0] = (this.target[0] - prevX) * invDt
    this.velocity[1] = (this.target[1] - prevY) * invDt
  }

  private handlePointerUp = (event: PointerEvent) => {
    if (!this.pointer.active || event.pointerId !== this.pointer.id) return
    this.pointer.active = false
    this.canvas.releasePointerCapture(event.pointerId)
    this.canvas.style.cursor = GOOGLE_MAPS_IDLE_CURSOR
    this.pointer.lastMoveTime = 0
  }

  private handleWheel = (event: WheelEvent) => {
    event.preventDefault()
    const rect = this.canvas.getBoundingClientRect()
    const scale = getDevicePixelRatio()
    const pointer = [
      (event.clientX - rect.left) * scale,
      (event.clientY - rect.top) * scale,
    ]
    const zoomFactor = Math.exp(-event.deltaY * 0.0015)
    const previousZoom = this.zoom
    const nextZoom = clamp(previousZoom * zoomFactor, MIN_ZOOM, MAX_ZOOM)
    if (nextZoom === previousZoom) return

    const { width, height, worldWidth, worldHeight } = this.getWorldDimensions()

    // Calculate world coordinates at pointer position before zoom
    const worldX = (pointer[0] - this.pan[0]) / (worldWidth * previousZoom)
    const worldY = (pointer[1] - this.pan[1]) / (worldHeight * previousZoom)

    // Update zoom
    this.zoom = nextZoom

    // Calculate new target so that worldX, worldY stays under the pointer
    this.target[0] = wrap01(
      worldX - (pointer[0] - width * 0.5) / (worldWidth * nextZoom),
    )
    this.target[1] = clamp01(
      worldY - (pointer[1] - height * 0.5) / (worldHeight * nextZoom),
    )
    this.updatePanFromTarget()
    this.velocity[0] = 0
    this.velocity[1] = 0
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "r" || event.key === "R") {
      this.resetView()
    }
  }

  private resizeCanvas() {
    const dpr = getDevicePixelRatio()
    const rect = this.canvas.getBoundingClientRect()
    const width = Math.max(1, Math.round(rect.width * dpr))
    const height = Math.max(1, Math.round(rect.height * dpr))
    if (width === this.canvas.width && height === this.canvas.height) {
      return
    }
    const prevWidth = this.canvas.width || width
    const prevHeight = this.canvas.height || height
    this.canvas.width = width
    this.canvas.height = height
    const scaleX = prevWidth ? width / prevWidth : 1
    const scaleY = prevHeight ? height / prevHeight : 1
    this.updatePanFromTarget()
    this.gl.viewport(0, 0, width, height)
  }

  private loop() {
    if (this.destroyed) return
    this.rafHandle = requestAnimationFrame(time => {
      const dt = time - this.lastFrameTime
      this.lastFrameTime = time
      const instantaneous = dt > 0 ? 1000 / dt : 0
      this.fps = this.fps * 0.9 + instantaneous * 0.1
      this.applyInertia(dt)
      this.render()
      const elapsed = time - this.lastHudTime
      if (this.onStatsChange && elapsed >= this.hudThrottleMs) {
        this.stats.fps = this.fps
        this.stats.zoom = this.zoom
        this.stats.cellSize = this.cellSize
        this.stats.squareSize = this.squareSize
        this.stats.quality = this.quality
        this.onStatsChange({ ...this.stats })
        this.lastHudTime = time
      }
      this.loop()
    })
  }

  private render() {
    const gl = this.gl
    const { width, height, worldWidth, worldHeight } = this.getWorldDimensions()
    gl.viewport(0, 0, width, height)
    gl.clearColor(this.seaColor[0], this.seaColor[1], this.seaColor[2], 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    const panX = wrapCentered(this.pan[0], worldWidth * this.zoom)
    const panY = this.pan[1]

    gl.useProgram(this.dotsProgram)
    gl.bindVertexArray(this.fullscreenVAO)
    setUniform2f(gl, this.dotsProgram, "uRes", width, height)
    setUniform2f(gl, this.dotsProgram, "uWorldSize", worldWidth, worldHeight)
    setUniform2f(gl, this.dotsProgram, "uPan", panX, panY)
    setUniform1f(gl, this.dotsProgram, "uZoom", this.zoom)
    setUniform1f(gl, this.dotsProgram, "uCell", this.cellSize)
    setUniform1f(gl, this.dotsProgram, "uSquare", this.squareSize)
    setUniform1i(gl, this.dotsProgram, "uQuality", this.quality)
    setUniform3f(
      gl,
      this.dotsProgram,
      "uLandColor",
      this.landColor[0],
      this.landColor[1],
      this.landColor[2],
    )
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.landTexture)
    setUniform1i(gl, this.dotsProgram, "uLand", 0)
    gl.drawArrays(gl.TRIANGLES, 0, 3)

    gl.useProgram(this.markersProgram)
    gl.bindVertexArray(this.markerVAO)
    setUniform2f(gl, this.markersProgram, "uRes", width, height)
    this.updateMarkerCenters(panX, panY)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.activeInstances)
    gl.disable(gl.BLEND)
    gl.bindVertexArray(null)
  }

  private updateMarkerCenters(panX: number, panY: number) {
    const { width, height, worldWidth, worldHeight } = this.getWorldDimensions()
    const zoom = this.zoom
    const period = worldWidth * zoom || worldWidth
    let cursor = 0
    for (let i = 0; i < this.markerInstances.length; i++) {
      const base = this.markerInstances[i]
      const baseX = base.uv[0] * period + panX
      const baseY = base.uv[1] * worldHeight * this.zoom + panY
      const wrapped = wrapPositive(baseX, period)
      cursor = this.writeMarker(cursor, wrapped, baseY, base)
      if (period < width + base.size) {
        cursor = this.writeMarker(cursor, wrapped + period, baseY, base)
        cursor = this.writeMarker(cursor, wrapped - period, baseY, base)
      }
    }
    this.activeInstances = cursor
    const centersView = this.centerData.subarray(0, cursor * 2)
    const sizeView = this.sizeScratch.subarray(0, cursor)
    const colorView = this.colorScratch.subarray(0, cursor * 4)

    const gl = this.gl
    gl.bindBuffer(gl.ARRAY_BUFFER, this.centerBuffer)
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, centersView)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.sizeBuffer)
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, sizeView)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer)
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, colorView)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

  private writeMarker(
    cursor: number,
    px: number,
    py: number,
    instance: MarkerInstance,
  ) {
    if (cursor >= this.instanceCapacity) {
      return cursor
    }
    const width = this.canvas.width || 1
    const margin = instance.size * 0.5
    if (px + margin < 0 || px - margin > width) {
      return cursor
    }
    const centerOffset = cursor * 2
    this.centerData[centerOffset + 0] = px
    this.centerData[centerOffset + 1] = py
    this.sizeScratch[cursor] = instance.size
    const colorOffset = cursor * 4
    this.colorScratch[colorOffset + 0] = instance.color[0]
    this.colorScratch[colorOffset + 1] = instance.color[1]
    this.colorScratch[colorOffset + 2] = instance.color[2]
    this.colorScratch[colorOffset + 3] = instance.color[3]
    return cursor + 1
  }

  private applyInertia(dtMs: number) {
    if (this.pointer.active) {
      return
    }
    const velX = this.velocity[0]
    const velY = this.velocity[1]
    if (Math.abs(velX) < INERTIA_EPS && Math.abs(velY) < INERTIA_EPS) {
      this.velocity[0] = 0
      this.velocity[1] = 0
      return
    }
    const dt = Math.max(dtMs, 0)
    this.target[0] = wrap01(this.target[0] + velX * dt)
    const nextY = clamp01(this.target[1] + velY * dt)
    if (nextY === 0 || nextY === 1) {
      this.velocity[1] = 0
    }
    this.target[1] = nextY
    this.updatePanFromTarget()
    const damping = Math.pow(INERTIA_DAMPING, dt / INERTIA_BASE_DT)
    this.velocity[0] = velX * damping
    this.velocity[1] = this.velocity[1] * damping
    if (Math.abs(this.velocity[0]) < INERTIA_EPS) this.velocity[0] = 0
    if (Math.abs(this.velocity[1]) < INERTIA_EPS) this.velocity[1] = 0
  }

  private updatePanFromTarget() {
    const { width, height, worldWidth, worldHeight } = this.getWorldDimensions()
    this.pan[0] = width * 0.5 - this.target[0] * worldWidth * this.zoom
    this.pan[1] = height * 0.5 - this.target[1] * worldHeight * this.zoom
  }

  private screenToWorld(px: number, py: number, zoom = this.zoom) {
    const { worldWidth, worldHeight } = this.getWorldDimensions()
    const x = worldWidth > 0 ? (px - this.pan[0]) / (worldWidth * zoom) : 0
    const y = worldHeight > 0 ? (py - this.pan[1]) / (worldHeight * zoom) : 0
    return [x, y] as [number, number]
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function wrapCentered(value: number, period: number) {
  if (!isFinite(period) || period <= 0) return value
  let wrapped = value % period
  if (wrapped > period * 0.5) wrapped -= period
  if (wrapped < -period * 0.5) wrapped += period
  return wrapped
}

function wrapPositive(value: number, period: number) {
  if (!isFinite(period) || period <= 0) return value
  let wrapped = value % period
  if (wrapped < 0) wrapped += period
  return wrapped
}

function wrap01(value: number) {
  let wrapped = value % 1
  if (wrapped < 0) wrapped += 1
  return wrapped
}

function clamp01(value: number) {
  return clamp(value, 0, 1)
}

function setUniform3f(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string,
  x: number,
  y: number,
  z: number,
) {
  const location = gl.getUniformLocation(program, name)
  if (location) {
    gl.uniform3f(location, x, y, z)
  }
}

function getDevicePixelRatio() {
  return Math.max(1, window.devicePixelRatio || 1)
}

function setUniform2f(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string,
  x: number,
  y: number,
) {
  const location = gl.getUniformLocation(program, name)
  if (location) {
    gl.uniform2f(location, x, y)
  }
}

function setUniform1f(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string,
  value: number,
) {
  const location = gl.getUniformLocation(program, name)
  if (location) {
    gl.uniform1f(location, value)
  }
}

function setUniform1i(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string,
  value: number,
) {
  const location = gl.getUniformLocation(program, name)
  if (location) {
    gl.uniform1i(location, value)
  }
}
