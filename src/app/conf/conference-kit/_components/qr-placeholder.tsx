// Deterministic 21×21 grid with three QR finder patterns. Real QR generation
// happens at print time; this is a faithful visual placeholder.
const N = 21
const FINDERS: [number, number][] = [
  [0, 0],
  [0, N - 7],
  [N - 7, 0],
]

const cells: [number, number][] = []
for (const [r, c] of FINDERS) {
  for (let i = 0; i < 7; i++)
    for (let j = 0; j < 7; j++) {
      const edge = i === 0 || i === 6 || j === 0 || j === 6
      const inner = i >= 2 && i <= 4 && j >= 2 && j <= 4
      if (edge || inner) cells.push([r + i, c + j])
    }
}
const inFinder = (r: number, c: number) =>
  FINDERS.some(([fr, fc]) => r >= fr && r < fr + 7 && c >= fc && c < fc + 7)
for (let r = 0; r < N; r++)
  for (let c = 0; c < N; c++) {
    if (inFinder(r, c)) continue
    const seed = ((r * 73856093) ^ (c * 19349663)) >>> 0
    if (seed % 100 < 46) cells.push([r, c])
  }

export interface QRPlaceholderProps {
  size?: number
  color?: string
}

export function QRPlaceholder({
  size = 56,
  color = "currentColor",
}: QRPlaceholderProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${N} ${N}`}
      shapeRendering="crispEdges"
      className="block"
      aria-hidden="true"
    >
      {cells.map(([r, c], i) => (
        <rect key={i} x={c} y={r} width="1" height="1" fill={color} />
      ))}
    </svg>
  )
}
