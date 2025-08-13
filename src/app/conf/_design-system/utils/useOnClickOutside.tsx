import { useEffect } from "react"

export function useOnClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: (event: MouseEvent) => void,
) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (ref.current && event.composedPath().includes(ref.current)) {
        return
      }
      handler(event)
    }

    document.addEventListener("click", listener)
    return () => document.removeEventListener("click", listener)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
