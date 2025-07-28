import ModemIcon from "@/app/conf/_design-system/pixelarticons/modem.svg?svgr"
import clsx from "clsx"

const INNER_BOX_SIZE = 16
const GAP_X = 32

interface ComponentTreeProps extends React.HTMLAttributes<HTMLDivElement> {
  names: [string, string, string, string]
}

export function ComponentTree({
  names,
  className,
  ...rest
}: ComponentTreeProps) {
  return (
    <div className={clsx("mx-auto flex gap-x-20", className)} {...rest}>
      <div className="flex flex-col">
        <div className="flex h-12 items-center">
          <ComponentLabel bgColor="bg-neu-0" borderColor="border-neu-300">
            {names[0]}
          </ComponentLabel>
        </div>

        <div className="h-4" />

        <div className="flex h-12 items-center">
          <ComponentLabel bgColor="bg-neu-400" borderColor="border-neu-600">
            {names[1]}
          </ComponentLabel>
        </div>

        <div className="h-4" />

        <div className="flex h-12 items-center">
          <ComponentLabel
            bgColor="bg-sec-lighter"
            borderColor="border-sec-base"
          >
            {names[2]}
          </ComponentLabel>
        </div>

        <div className="h-4" />

        <div className="flex h-12 items-center">
          <ComponentLabel
            bgColor="bg-pri-lighter/40"
            borderColor="border-pri-base"
          >
            {names[3]}
          </ComponentLabel>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex size-12 items-center justify-center bg-neu-100">
          <ModemIcon className="size-8 text-neu-600" />
        </div>

        <div className="h-4 w-px bg-neu-300" />

        <NestedBox
          bgColor="bg-neu-600"
          middleColor="bg-sec-base"
          innerColor="bg-pri-base"
        />

        <Fork
          className="text-neu-300"
          style={{
            width: `calc(100% - ${GAP_X + INNER_BOX_SIZE * 5.75}px)`,
          }}
        />

        <div className="flex" style={{ gap: GAP_X }}>
          <div className="flex flex-col items-center">
            <NestedBox
              bgColor="bg-neu-100"
              middleColor="bg-sec-base"
              innerColor="bg-pri-base"
            />
            <Fork className="text-neu-300" />
            <div className="flex" style={{ gap: GAP_X }}>
              <LeafBox />
              <LeafBox />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <NestedBox
              bgColor="bg-neu-100"
              middleColor="bg-sec-base"
              innerColor="bg-pri-base"
            />
            <Fork className="text-neu-300" />
            <div className="flex" style={{ gap: GAP_X }}>
              <LeafBox />
              <LeafBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface NestedBoxProps {
  bgColor: string
  middleColor?: string
  innerColor: string
}

function NestedBox({ bgColor, middleColor, innerColor }: NestedBoxProps) {
  const padding = INNER_BOX_SIZE / 2

  return (
    <div className={bgColor} style={{ padding }}>
      <div className={middleColor || bgColor} style={{ padding }}>
        <div className={innerColor} style={{ padding }} />
      </div>
    </div>
  )
}

interface ComponentLabelProps {
  children: React.ReactNode
  bgColor: string
  borderColor: string
}

function ComponentLabel({
  children,
  bgColor,
  borderColor,
}: ComponentLabelProps) {
  return (
    <div
      className={`rounded border ${borderColor} ${bgColor} px-1 py-0.5 font-mono text-[10px] text-neu-800`}
    >
      {children}
    </div>
  )
}

function LeafBox() {
  return <NestedBox bgColor="bg-neu-100" innerColor="bg-pri-base" />
}

function Fork(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="81"
      height="16"
      viewBox="0 0 81 16"
      stroke="currentColor"
      fill="none"
      preserveAspectRatio="none"
      {...props}
    >
      <path d="M40.5 8V0M1 16V8m79 8V8" vectorEffect="non-scaling-stroke" />
      <path
        d="m1 8 79-.00001"
        stroke-linecap="square"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
