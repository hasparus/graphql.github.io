import OptimizationSvg from "./optimization.svg?svgr"

export function OptimizationFigure() {
  return (
    <div
      className="flex w-full bg-gradient-to-b from-transparent to-sec-lighter px-[14px] py-[30px] *:w-1/2 dark:to-sec-darker/25 xl:px-[46px] [&_pre]:!h-48"
      aria-hidden
    >
      <OptimizationSvg />
    </div>
  )
}
