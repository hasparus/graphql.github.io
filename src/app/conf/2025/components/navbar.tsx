"use client"

import { ReactElement, useCallback, useEffect, useState } from "react"
import NextLink from "next/link"
import { clsx } from "clsx"
import { usePathname } from "next/navigation"

import { Badge } from "../../_components/badge"

import MenuIcon from "../pixelarticons/menu.svg?svgr"
import CloseIcon from "../pixelarticons/close.svg?svgr"
import { GraphQLConfLogoLink } from "./graphql-conf-logo-link"

export interface NavbarProps {
  links: { href: string; children: React.ReactNode; "aria-disabled"?: true }[]
  year: number
}

export function Navbar({ links, year }: NavbarProps): ReactElement {
  const pathname = usePathname()
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const handleDrawerClick = useCallback(() => {
    setMobileDrawerOpen(prev => !prev)
  }, [])

  useEffect(() => {
    setMobileDrawerOpen(false)
  }, [pathname])

  return (
    <>
      <div
        className={clsx(
          "top-0 w-full scale-y-105 bg-pri-base dark:bg-pri-darker",
          mobileDrawerOpen ? "static" : "absolute",
        )}
      />
      <div
        // placeholder: the colors here on `before` must match the ones on Hero `before` strip
        className="absolute h-[calc(var(--navbar-h)+1px)] w-full bg-pri-base before:absolute before:top-0 before:h-[calc(var(--navbar-h)+1px)] before:w-full before:bg-white/30 dark:bg-pri-darker dark:before:bg-black/40"
      />
      <header
        className={clsx(
          "gql-all-anchors-focusable top-0 z-10 w-full border-b border-black/60 font-mono text-neu-900 antialiased dark:border-white/80",
          mobileDrawerOpen
            ? "fixed border-neu-900 dark:border-white"
            : "sticky",
        )}
      >
        <BackdropBlur />
        <div className="flex h-[var(--navbar-h)] items-center justify-between gap-5 px-4 lg:px-10">
          <GraphQLConfLogoLink year={year} />

          <div className="mr-auto flex h-full flex-col justify-center whitespace-pre border-x border-black/60 px-4 typography-menu dark:border-white/80 max-xl:hidden">
            <p className="flex items-center gap-2 text-sm">
              <time dateTime="2025-09-08">September 08</time>
              <span>-</span>
              <time dateTime="2025-09-10">10, 2025</time>
            </p>
            <address className="text-sm not-italic">
              Amsterdam, Netherlands
            </address>
          </div>

          {mobileDrawerOpen && (
            <div
              onClick={handleDrawerClick}
              className="fixed inset-0 top-[calc(var(--navbar-h)+1px)] z-10 bg-neu-0/40 backdrop-blur-[6.4px]"
            />
          )}

          <nav
            className={clsx(
              "inset-0 z-20 flex gap-7 typography-menu max-lg:fixed max-lg:mt-[calc(var(--navbar-h)+1px)] max-lg:flex-col max-md:min-w-[50%] sm:max-lg:p-4 lg:items-end",
              mobileDrawerOpen ? "translate-x-0" : "max-lg:translate-x-full",
            )}
          >
            <div className="flex w-full flex-col lg:mt-0 lg:block">
              {links.map(
                ({ "aria-disabled": isDisabled, children, ...link }) => (
                  <NextLink
                    aria-disabled={isDisabled}
                    key={link.href}
                    {...link}
                    // if external link, open in new tab
                    {...(link.href.startsWith("https") && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                    className={clsx(
                      "p-5 underline-offset-4 hover:underline aria-disabled:pointer-events-none max-lg:text-base",
                      pathname === link.href && "underline",
                    )}
                  >
                    {children}
                    {isDisabled && (
                      <sup className="ml-2">
                        <Badge className="text-white">Soon</Badge>
                      </sup>
                    )}
                  </NextLink>
                ),
              )}
            </div>
          </nav>

          <button
            className="gql-focus-visible z-40 ml-auto size-7 hover:bg-neu-900/10 lg:hidden"
            onClick={handleDrawerClick}
          >
            {mobileDrawerOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>
    </>
  )
}

function BackdropBlur() {
  const mask = "linear-gradient(to bottom,#000 0% 50%, transparent 50% 100%)"
  return (
    <div
      // note: we can't use the background trick to reduce flickering, because we have many section
      // background colors and big images, so we'd have to change the --bg var with javascript
      className="pointer-events-none absolute inset-0 -z-10 h-[200%] backdrop-blur-[6.4px]"
      style={{
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  )
}
