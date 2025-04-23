"use client"

import {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react"
import NextLink from "next/link"
import { clsx } from "clsx"
import { usePathname } from "next/navigation"

import { HamburgerIcon, CrossIcon } from "@/icons"

import { Badge } from "../../_components/badge"

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
        /* pink background "prelude" */ className={clsx(
          "top-0 h-[70px] w-full scale-y-105 bg-pri-base dark:bg-pri-darker",
          mobileDrawerOpen ? "static" : "absolute",
        )}
      />
      <header
        // todo: not white, but ALWAYS contrasting color, either white or black depending on background
        className={clsx(
          "top-0 z-10 w-full border-b border-white/70 bg-white/20 font-mono text-white antialiased",
          mobileDrawerOpen ? "fixed" : "sticky",
        )}
      >
        <div
          /* navbar backdrop */ className="absolute inset-0 -z-10 backdrop-blur-[6.4px]"
        />
        {/* todo: better backdrop */}
        <div className="container flex h-[70px] items-center justify-between gap-5">
          <div className="flex items-center gap-2 text-xl/none uppercase">
            <NextLink href="/">
              <GraphQLLogo className="h-6" />
            </NextLink>
            <span>/ GraphQLConf {year}</span>
          </div>

          {mobileDrawerOpen && (
            <div
              onClick={handleDrawerClick}
              className="fixed inset-0 top-[71px] z-10 bg-neu-0/40 backdrop-blur-[6.4px]"
            />
          )}

          <nav
            className={clsx(
              "inset-0 z-20 flex gap-7 typography-menu max-lg:fixed max-lg:mt-[71px] max-lg:flex-col max-md:min-w-[50%] sm:max-lg:p-4 lg:items-end",
              mobileDrawerOpen
                ? "translate-x-0 text-neu-900"
                : "text-white max-lg:translate-x-full",
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
            className="z-40 ml-auto size-6 text-white lg:hidden"
            onClick={handleDrawerClick}
          >
            {mobileDrawerOpen ? <CrossIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </header>
    </>
  )
}

function GraphQLLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M50 6.90308L87.323 28.4515V71.5484L50 93.0968L12.677 71.5484V28.4515L50 6.90308ZM16.8647 30.8693V62.5251L44.2795 15.0414L16.8647 30.8693ZM50 13.5086L18.3975 68.2457H81.6025L50 13.5086ZM77.4148 72.4334H22.5852L50 88.2613L77.4148 72.4334ZM83.1353 62.5251L55.7205 15.0414L83.1353 30.8693V62.5251Z"
      />
      <circle cx="50" cy="9.3209" r="8.82" />
      <circle cx="85.2292" cy="29.6605" r="8.82" />
      <circle cx="85.2292" cy="70.3396" r="8.82" />
      <circle cx="50" cy="90.6791" r="8.82" />
      <circle cx="14.7659" cy="70.3396" r="8.82" />
      <circle cx="14.7659" cy="29.6605" r="8.82" />
    </svg>
  )
}
