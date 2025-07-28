import ModemIcon from "@/app/conf/_design-system/pixelarticons/modem.svg?svgr"
import clsx from "clsx"

const INNER_BOX_SIZE = 16

interface ComponentTreeProps extends React.HTMLAttributes<HTMLDivElement> {
  names: [string, string, string, string]
}

export function ComponentTree({
  names,
  className,
  ...rest
}: ComponentTreeProps) {
  return (
    <div
      className={clsx(
        "mx-auto flex max-w-[500px] justify-between [--gap-x:20px] md:gap-x-10 md:[--gap-x:32px] 3xl:gap-x-20",
        className,
      )}
      {...rest}
    >
      <div className="flex flex-col">
        <div className="flex h-12 items-center">
          <ComponentLabel className="border-neu-300 bg-neu-0 dark:border-neu-200">
            {names[0]}
          </ComponentLabel>
        </div>

        <div className="h-4" />

        <div className="flex h-12 items-center">
          <ComponentLabel className="border-neu-600 bg-neu-400 dark:border-neu-200 dark:bg-neu-50">
            {names[1]}
          </ComponentLabel>
        </div>

        <div className="h-4" />

        <div className="flex h-12 items-center">
          <ComponentLabel className="border-sec-base bg-sec-lighter dark:border-sec-dark dark:bg-sec-darker/50">
            {names[2]}
          </ComponentLabel>
        </div>

        <div className="h-4" />

        <div className="flex h-12 items-center">
          <ComponentLabel className="border-pri-base bg-pri-lighter/40 dark:border-pri-dark dark:bg-pri-darker/50">
            {names[3]}
          </ComponentLabel>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex size-12 items-center justify-center bg-neu-100 dark:bg-neu-50">
          <ModemIcon className="size-6 text-neu-600" />
        </div>

        <div className="h-4 w-px bg-neu-300 dark:bg-neu-100" />

        <NestedBox
          bgColor="bg-neu-600 dark:bg-neu-200"
          middleColor="bg-sec-base"
          innerColor="bg-pri-base"
        />

        <Fork
          className="text-neu-300 dark:text-neu-100"
          style={{
            width: `calc(100% - var(--gap-x) - ${INNER_BOX_SIZE * 5.75}px)`,
          }}
        />

        <div className="flex gap-[--gap-x]">
          <div className="flex flex-col items-center">
            <NestedBox
              bgColor="bg-neu-100 dark:bg-neu-50"
              middleColor="bg-sec-base"
              innerColor="bg-pri-base"
            />
            <Fork className="text-neu-300 dark:text-neu-100" />
            <div className="flex gap-[--gap-x]">
              <LeafBox />
              <LeafBox />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <NestedBox
              bgColor="bg-neu-100 dark:bg-neu-50"
              middleColor="bg-sec-base"
              innerColor="bg-pri-base"
            />
            <Fork className="text-neu-300 dark:text-neu-100" />
            <div className="flex gap-[--gap-x]">
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
  className: string
}

function ComponentLabel({ children, className }: ComponentLabelProps) {
  return (
    <div
      className={clsx(
        "rounded border px-1 py-0.5 font-mono text-[10px] text-neu-800 dark:font-medium",
        className,
      )}
    >
      {children}
    </div>
  )
}

function LeafBox() {
  return (
    <NestedBox bgColor="bg-neu-100 dark:bg-neu-50" innerColor="bg-pri-base" />
  )
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
