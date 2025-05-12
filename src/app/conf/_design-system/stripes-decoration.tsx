import clsx from "clsx"

const maskEven =
  "repeating-linear-gradient(to right, transparent, transparent 12px, black 12px, black 24px)"

const maskOdd =
  "repeating-linear-gradient(to right, black, black 12px, transparent 12px, transparent 24px)"

export interface StripesDecorationProps {
  evenClassName?: string
  oddClassName?: string
}

export function StripesDecoration(props: StripesDecorationProps) {
  return (
    <>
      {props.evenClassName && (
        <div
          className={clsx("absolute inset-0", props.evenClassName)}
          style={{
            maskImage: maskEven,
            WebkitMaskImage: maskEven,
          }}
        />
      )}
      {props.oddClassName && (
        <div
          className={clsx("absolute inset-0", props.oddClassName)}
          style={{
            maskImage: maskOdd,
            WebkitMaskImage: maskOdd,
          }}
        />
      )}
    </>
  )
}
