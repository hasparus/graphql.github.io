"use client"
import { MenuProvider as NextraMenuProvider } from "nextra-theme-docs"
import { useMemo, useState } from "react"

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState(false)
  const value = useMemo(() => ({ menu, setMenu }), [menu])
  return <NextraMenuProvider value={value}>{children}</NextraMenuProvider>
}
