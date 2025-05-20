import clsx from "clsx"

const maskEvenWide =
  "repeating-linear-gradient(to right, transparent, transparent 12px, black 12px, black 24px)"

const maskOddWide =
  "repeating-linear-gradient(to right, black, black 12px, transparent 12px, transparent 24px)"

const maskEvenThin =
  "repeating-linear-gradient(to right, transparent, transparent 5.2px, black 5.2px, black 10.4px)"

const maskOddThin =
  "repeating-linear-gradient(to right, black, black 5.2px, transparent 5.2px, transparent 10.4px)"

export interface StripesDecorationProps {
  evenClassName?: string
  oddClassName?: string
  thin?: boolean
}

export function StripesDecoration(props: StripesDecorationProps) {
  const [maskEven, maskOdd] = props.thin
    ? [maskEvenThin, maskOddThin]
    : [maskEvenWide, maskOddWide]

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
