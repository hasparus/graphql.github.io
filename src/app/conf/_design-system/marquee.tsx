"use client"

import { clsx } from "clsx"
import { useMotionValue, animate, motion } from "motion/react"
import { useState, useEffect, Fragment } from "react"
import useMeasure from "react-use-measure"

export interface MarqueeProps {
  children: React.ReactNode
  gap?: number
  speed?: number
  speedOnHover?: number
  direction?: "horizontal" | "vertical"
  reverse?: boolean
  className?: string
  drag?: boolean
  separator?: React.ReactNode
}

export function Marquee({
  children,
  gap = 16,
  speed = 100,
  speedOnHover,
  direction = "horizontal",
  reverse = false,
  className,
  drag = false,
  separator,
}: MarqueeProps) {
  const [currentSpeed, setCurrentSpeed] = useState(speed)
  const [ref, { width, height }] = useMeasure()
  const translation = useMotionValue(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [key, setKey] = useState(0)

  useEffect(() => {
    let controls
    const size = direction === "horizontal" ? width : height
    const contentSize = size + gap
    const from = reverse ? 0 : -contentSize / 2
    const to = reverse ? -contentSize / 2 : 0

    const distanceToTravel = Math.abs(to - from)
    const duration = distanceToTravel / currentSpeed

    if (isTransitioning) {
      const remainingDistance = Math.abs(translation.get() - to)
      const transitionDuration = remainingDistance / currentSpeed

      controls = animate(translation, [translation.get(), to], {
        ease: "linear",
        duration: transitionDuration,
        onComplete: () => {
          setIsTransitioning(false)
          setKey(prevKey => prevKey + 1)
        },
      })
    } else {
      controls = animate(translation, [from, to], {
        ease: "linear",
        duration: duration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from)
        },
      })
    }

    return controls?.stop
  }, [
    key,
    translation,
    currentSpeed,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
  ])

  const hoverProps =
    speedOnHover != null
      ? {
          onHoverStart: () => {
            setIsTransitioning(true)
            setCurrentSpeed(speedOnHover)
          },
          onHoverEnd: () => {
            setIsTransitioning(true)
            setCurrentSpeed(speed)
          },
          onPointerUp: () => {
            if (window.matchMedia("(hover: none)").matches) {
              setIsTransitioning(true)
              setCurrentSpeed(speed)
            }
          },
        }
      : {}

  const multiples = drag ? 12 : 2
  const dragProps = drag
    ? {
        drag: "x" as const,
        onDragStart: () => {
          document.documentElement.style.cursor = "grabbing"
        },
        onDragEnd: () => {
          document.documentElement.style.cursor = "initial"
        },
      }
    : {}

  return (
    <div className={clsx("overflow-hidden", className)}>
      <motion.div
        className="flex w-max"
        style={{
          ...(direction === "horizontal"
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
          alignItems: "center",
        }}
        ref={ref}
        {...dragProps}
        {...hoverProps}
      >
        {Array.from({ length: multiples }).map((_, i) => (
          <Fragment key={i}>
            {children}
            {separator}
          </Fragment>
        ))}
      </motion.div>
    </div>
  )
}
