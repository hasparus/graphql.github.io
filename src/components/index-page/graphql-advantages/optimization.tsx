import OptimizationSvg from "./optimization.svg?svgr"

export function OptimizationFigure() {
  return (
    <div
      className="flex w-full bg-gradient-to-b from-[hsla(75,57%,97%,0)] to-white px-[14px] py-[30px] dark:to-neu-100/20 xl:px-[46px] [&_pre]:!h-48"
      aria-hidden
    >
      <OptimizationSvg />
    </div>
  )
}
