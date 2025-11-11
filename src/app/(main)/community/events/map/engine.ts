import { createProgram, initGL, loadLandMaskTexture } from "./gl-utils"
import { lonLatToUV, uvToLonLat } from "./projection"
import { dotsFrag, fullscreenVert, MARKER_CAPACITY } from "./shaders"
import {
  clamp,
  clampLatitude,
  computeLatitudeBounds,
  computePointerVelocity,
  computeWorldDimensions,
  dragTargetByPixels,
  screenToWorld as projectScreenToWorld,
  stepInertia,
  updatePanFromTarget,
  wrap01,
  wrapCentered,
  zoomAroundPointer,
  type LatitudeBounds,
  type WorldDimensions,
} from "./viewport-math"
import type { MapColors } from "./map-colors"

export type SamplingQuality = 1 | 4 | 16

export type MarkerPoint = {
  id: string
  lon: number
  lat: number
  isHub?: boolean
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
  signal?: AbortSignal
}

const MIN_ZOOM = 1
const MAX_ZOOM = 20
const MARKER_TYPE_REGULAR = 1
const MARKER_TYPE_HUB = 2
/**
 * Per-frame damping factor (scaled by dt / (1/60s)).
 * Decrease value to increase damping.
 */
const INERTIA_DAMPING = 0.87
/** Reference frame time in milliseconds for the damping exponent. */
const INERTIA_BASE_DT = 1000 / 60
/** Velocities below this normalized threshold snap directly to zero. */
const INERTIA_EPS = 1e-5
const DEVTOOLS_ENABLED = process.env.NODE_ENV !== "production"

export async function bootMeetupsMap(options: BootOptions): Promise<MapHandle> {
  const gl = initGL(options.canvas)
  const dotsProgram = createProgram(gl, fullscreenVert, dotsFrag)
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
      landTexture,
    })
  } catch (error) {
    gl.deleteProgram(dotsProgram)
    if (landTexture) gl.deleteTexture(landTexture)
    throw error
  }
}

type InternalOptions = BootOptions & {
  gl: WebGL2RenderingContext
  dotsProgram: WebGLProgram
  landTexture: WebGLTexture
}

class MapEngine implements MapHandle {
  private gl: WebGL2RenderingContext
  private canvas: HTMLCanvasElement
  private dotsProgram: WebGLProgram
  private landTexture: WebGLTexture
  private quality: SamplingQuality
  private cellSize: number
  private squareSize: number
  private aspectRatio: number
  private zoom = 1
  private pan = new Float32Array([0, 0])
  private target = new Float32Array([0.5, 0.5])
  private velocity = new Float32Array([0, 0])
  private pixelRatio = getDevicePixelRatio()
  private seaColor: Float32Array
  private landColor: Float32Array
  private readonly fullscreenVAO: WebGLVertexArrayObject
  private readonly markerPoints: MarkerPoint[]
  private readonly markerData: Float32Array
  private markerCount: number
  private markerCapacityWarned = false
  private readonly markerColor: Float32Array
  private readonly hubMarkerColor: Float32Array
  private readonly resizeObserver: ResizeObserver
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
    this.landTexture = options.landTexture
    this.aspectRatio = options.aspectRatio
    this.quality = options.initialQuality
    this.cellSize = options.initialCellSize
    this.squareSize = Math.min(options.initialSquareSize, this.cellSize)

    this.seaColor = new Float32Array(options.theme.sea)
    this.landColor = new Float32Array(options.theme.land)
    this.markerPoints = options.markers
    this.markerData = new Float32Array(MARKER_CAPACITY * 4)
    this.markerCount = this.packMarkers(this.markerPoints, this.markerData)
    this.markerColor = new Float32Array(options.theme.marker)
    this.hubMarkerColor = new Float32Array(options.theme.marker)

    const gl = this.gl
    this.fullscreenVAO = gl.createVertexArray() as WebGLVertexArrayObject
    this.uploadMarkerUniforms()

    this.resizeObserver = new ResizeObserver(() => this.resizeCanvas())
    this.resizeObserver.observe(this.canvas)
    this.resizeCanvas()
    this.updatePanFromTarget()
    this.attachEvents()
    this.attachDevtools()
    this.loop()
  }

  dispose() {
    if (this.destroyed) return
    this.destroyed = true
    cancelAnimationFrame(this.rafHandle)
    this.resizeObserver.disconnect()
    this.detachEvents()
    this.detachDevtools()
    const gl = this.gl
    gl.deleteProgram(this.dotsProgram)
    gl.deleteTexture(this.landTexture)
    gl.deleteVertexArray(this.fullscreenVAO)
  }

  setQuality(value: SamplingQuality) {
    if (value === this.quality) return
    this.quality = value
  }

  setCellSize(value: number) {
    const next = value
    if (next === this.cellSize) return
    this.cellSize = next
    if (this.squareSize > this.cellSize) {
      this.squareSize = this.cellSize
    }
  }

  setSquareSize(value: number) {
    const next = Math.min(value, this.cellSize)
    if (next === this.squareSize) return
    this.squareSize = next
  }

  setThemeColors(colors: MapColors) {
    this.seaColor.set(colors.sea)
    this.landColor.set(colors.land)
    this.markerColor.set(colors.marker)
    this.hubMarkerColor.set(colors.marker)
  }

  private uploadMarkerUniforms() {
    const gl = this.gl
    gl.useProgram(this.dotsProgram)
    const location = gl.getUniformLocation(this.dotsProgram, "uMarkers")
    if (location) {
      gl.uniform4fv(location, this.markerData)
    }
  }

  private getWorldDimensions(): WorldDimensions {
    return computeWorldDimensions(
      this.canvas.width,
      this.canvas.height,
      this.aspectRatio,
    )
  }

  private clampLatitude(value: number) {
    return clampLatitude(value, this.getLatitudeBounds())
  }

  private getLatitudeBounds(): LatitudeBounds {
    const { height, worldHeight } = this.getWorldDimensions()
    return computeLatitudeBounds(height, worldHeight, this.zoom)
  }

  resetView() {
    this.zoom = 1
    this.target[0] = 0.5
    this.target[1] = 0.5
    this.velocity[0] = 0
    this.velocity[1] = 0
    this.updatePanFromTarget()
  }

  private packMarkers(markers: MarkerPoint[], target: Float32Array) {
    const capacity = MARKER_CAPACITY
    const count = Math.min(markers.length, capacity)
    for (let i = 0; i < count; i++) {
      const marker = markers[i]
      const uv = lonLatToUV(marker.lon, marker.lat)
      const base = i * 4
      target[base + 0] = uv[0]
      target[base + 1] = 1 - uv[1]
      target[base + 2] = marker.isHub ? MARKER_TYPE_HUB : MARKER_TYPE_REGULAR
      target[base + 3] = 0
    }
    if (markers.length > capacity && !this.markerCapacityWarned) {
      console.warn(
        `Meetups map: capped marker count at ${capacity} (received ${markers.length}).`,
      )
      this.markerCapacityWarned = true
    }
    return count
  }

  private attachEvents() {
    this.canvas.style.cursor = "default"
    this.canvas.addEventListener("pointerdown", this.handlePointerDown)
    this.canvas.addEventListener("pointermove", this.handlePointerMove)
    this.canvas.addEventListener("pointerup", this.handlePointerUp)
    this.canvas.addEventListener("pointerleave", this.handlePointerUp)
    this.canvas.addEventListener("pointercancel", this.handlePointerUp)
    this.canvas.addEventListener("wheel", this.handleWheel, { passive: false })
    window.addEventListener("keydown", this.handleKeyDown)
    window.addEventListener("resize", this.handleWindowResize)
  }

  private detachEvents() {
    this.canvas.removeEventListener("pointerdown", this.handlePointerDown)
    this.canvas.removeEventListener("pointermove", this.handlePointerMove)
    this.canvas.removeEventListener("pointerup", this.handlePointerUp)
    this.canvas.removeEventListener("pointerleave", this.handlePointerUp)
    this.canvas.removeEventListener("pointercancel", this.handlePointerUp)
    this.canvas.removeEventListener("wheel", this.handleWheel)
    window.removeEventListener("keydown", this.handleKeyDown)
    window.removeEventListener("resize", this.handleWindowResize)
  }

  private attachDevtools() {
    if (!DEVTOOLS_ENABLED) return
    this.canvas.addEventListener("click", this.handleDebugClick)
  }

  private detachDevtools() {
    if (!DEVTOOLS_ENABLED) return
    this.canvas.removeEventListener("click", this.handleDebugClick)
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
    this.canvas.style.cursor = "move"
  }

  private handlePointerMove = (event: PointerEvent) => {
    if (!this.pointer.active || event.pointerId !== this.pointer.id) return
    const scale = this.pixelRatio
    const dx = (event.clientX - this.pointer.startX) * scale
    const dy = (event.clientY - this.pointer.startY) * scale
    const dims = this.getWorldDimensions()
    const prevX = this.target[0]
    const prevY = this.target[1]
    const nextTarget = dragTargetByPixels(
      this.pointer.targetAtStart,
      dx,
      dy,
      this.zoom,
      dims,
    )
    this.target[0] = nextTarget[0]
    this.target[1] = this.clampLatitude(nextTarget[1])
    this.updatePanFromTarget()

    const now = performance.now()
    const last = this.pointer.lastMoveTime || now
    const dt = Math.max(now - last, 1)
    this.pointer.lastMoveTime = now
    const velocity = computePointerVelocity(
      [prevX, prevY],
      [this.target[0], this.target[1]],
      dt,
    )
    this.velocity[0] = velocity[0]
    this.velocity[1] = velocity[1]
  }

  private handlePointerUp = (event: PointerEvent) => {
    if (!this.pointer.active || event.pointerId !== this.pointer.id) return
    this.pointer.active = false
    this.canvas.releasePointerCapture(event.pointerId)
    this.canvas.style.cursor = "default"
    this.pointer.lastMoveTime = 0
  }

  private handleDebugClick = (event: MouseEvent) => {
    if (!DEVTOOLS_ENABLED) return
    const rect = this.canvas.getBoundingClientRect()
    const scale = this.pixelRatio
    const px = (event.clientX - rect.left) * scale
    const py = (event.clientY - rect.top) * scale
    const [worldX, worldY] = this.screenToWorld(px, py)
    const uvY = 1 - clamp(worldY, 0, 1)
    const { lon, lat } = uvToLonLat(wrap01(worldX), uvY)
    console.debug(
      `MeetupsMap click → lat ${lat.toFixed(2)}, lon ${lon.toFixed(2)}`,
    )
  }

  private handleWheel = (event: WheelEvent) => {
    event.preventDefault()
    const rect = this.canvas.getBoundingClientRect()
    const scale = this.pixelRatio
    const pointer = [
      (event.clientX - rect.left) * scale,
      (event.clientY - rect.top) * scale,
    ]
    const wheelSensitivity = event.ctrlKey ? 0.005 : 0.0015
    const zoomFactor = Math.exp(-event.deltaY * wheelSensitivity)
    const previousZoom = this.zoom
    const nextZoom = clamp(previousZoom * zoomFactor, MIN_ZOOM, MAX_ZOOM)
    if (nextZoom === previousZoom) return

    const dims = this.getWorldDimensions()
    const [nextTargetX, nextTargetY] = zoomAroundPointer({
      pointerPx: pointer[0],
      pointerPy: pointer[1],
      previousZoom,
      nextZoom,
      pan: this.pan,
      dims,
    })
    this.zoom = nextZoom
    this.target[0] = nextTargetX
    this.target[1] = this.clampLatitude(nextTargetY)
    this.updatePanFromTarget()
    this.velocity[0] = 0
    this.velocity[1] = 0
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "r" || event.key === "R") {
      this.resetView()
    }
  }

  private handleWindowResize = () => {
    this.resizeCanvas()
  }

  private resizeCanvas(explicitPixelRatio?: number) {
    const dpr = explicitPixelRatio ?? getDevicePixelRatio()
    this.pixelRatio = dpr
    const rect = this.canvas.getBoundingClientRect()
    const width = Math.max(1, Math.round(rect.width * dpr))
    const height = Math.max(1, Math.round(rect.height * dpr))
    if (width === this.canvas.width && height === this.canvas.height) {
      return
    }
    this.canvas.width = width
    this.canvas.height = height
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
      this.loop()
    })
  }

  private render() {
    const gl = this.gl
    this.syncPixelRatio()
    const { width, height, worldWidth, worldHeight } = this.getWorldDimensions()
    gl.viewport(0, 0, width, height)
    gl.clearColor(this.seaColor[0], this.seaColor[1], this.seaColor[2], 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    const panX = wrapCentered(this.pan[0], worldWidth * this.zoom)
    const panY = this.pan[1]
    const deviceCell = this.cellSize * this.pixelRatio
    const deviceSquare = this.squareSize * this.pixelRatio

    gl.useProgram(this.dotsProgram)
    gl.bindVertexArray(this.fullscreenVAO)
    setUniform2f(gl, this.dotsProgram, "uRes", width, height)
    setUniform2f(gl, this.dotsProgram, "uWorldSize", worldWidth, worldHeight)
    setUniform2f(gl, this.dotsProgram, "uPan", panX, panY)
    setUniform1f(gl, this.dotsProgram, "uZoom", this.zoom)
    setUniform1f(gl, this.dotsProgram, "uCell", deviceCell)
    setUniform1f(gl, this.dotsProgram, "uSquare", deviceSquare)
    setUniform1i(gl, this.dotsProgram, "uQuality", this.quality)
    setUniform3f(
      gl,
      this.dotsProgram,
      "uLandColor",
      this.landColor[0],
      this.landColor[1],
      this.landColor[2],
    )
    setUniform3f(
      gl,
      this.dotsProgram,
      "uMarkerColor",
      this.markerColor[0],
      this.markerColor[1],
      this.markerColor[2],
    )
    setUniform3f(
      gl,
      this.dotsProgram,
      "uHubMarkerColor",
      this.hubMarkerColor[0],
      this.hubMarkerColor[1],
      this.hubMarkerColor[2],
    )
    setUniform1i(gl, this.dotsProgram, "uMarkerCount", this.markerCount)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.landTexture)
    setUniform1i(gl, this.dotsProgram, "uLand", 0)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  private syncPixelRatio() {
    const ratio = getDevicePixelRatio()
    if (ratio !== this.pixelRatio) {
      this.resizeCanvas(ratio)
    }
  }

  private applyInertia(dtMs: number) {
    if (this.pointer.active) {
      return
    }
    const result = stepInertia({
      target: [this.target[0], this.target[1]],
      velocity: [this.velocity[0], this.velocity[1]],
      dtMs,
      bounds: this.getLatitudeBounds(),
      damping: INERTIA_DAMPING,
      baseDt: INERTIA_BASE_DT,
      velocityEps: INERTIA_EPS,
    })
    if (!result.moved && result.velocity[0] === 0 && result.velocity[1] === 0) {
      this.velocity[0] = 0
      this.velocity[1] = 0
      return
    }
    this.target[0] = result.target[0]
    this.target[1] = result.target[1]
    this.velocity[0] = result.velocity[0]
    this.velocity[1] = result.velocity[1]
    if (result.moved) {
      this.updatePanFromTarget()
    }
  }

  private updatePanFromTarget() {
    const dims = this.getWorldDimensions()
    const [panX, panY] = updatePanFromTarget(this.target, this.zoom, dims)
    this.pan[0] = panX
    this.pan[1] = panY
  }

  private screenToWorld(px: number, py: number, zoom = this.zoom) {
    const dims = this.getWorldDimensions()
    return projectScreenToWorld(px, py, this.pan, zoom, dims)
  }
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
