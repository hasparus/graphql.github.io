"use client"

import clsx from "clsx"
import type * as normalizePages from "nextra/normalize-pages"
import React from "react"
import { Anchor } from "../../app/conf/_design-system/anchor"
import { linkClasses } from "./navbar"
import { usePathname } from "next/navigation"

export interface NavLinkProps {
  href: string
  isActive: boolean
  page: normalizePages.PageItem
}

export function NavLink({
  href,
  page,
}: {
  href: string
  page: normalizePages.PageItem
}) {
  const pathname = usePathname() || "/"

  const isActive =
    page.route === pathname || pathname.startsWith(page.route + "/")

  return (
    <Anchor
      href={href}
      className={clsx(
        linkClasses,
        "whitespace-nowrap max-md:hidden",
        isActive && !page.newWindow && "underline",
      )}
      target={page.newWindow ? "_blank" : undefined}
      aria-current={!page.newWindow && isActive}
    >
      {page.title}
    </Anchor>
  )
}
