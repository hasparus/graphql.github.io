const mercatorLimit = 85.05112878

export type UV = [number, number]

export function lonLatToUV(lon: number, lat: number): UV {
  const wrappedLon = ((lon + 180) % 360 + 360) % 360 - 180
  const u = (wrappedLon + 180) / 360
  const clampedLat = Math.max(-mercatorLimit, Math.min(mercatorLimit, lat))
  const rad = (clampedLat * Math.PI) / 180
  const v = 0.5 - Math.log(Math.tan(Math.PI * 0.25 + rad * 0.5)) / (2 * Math.PI)
  return [u, v]
}
