"use client"

import { clsx } from "clsx"
// @ts-expect-error we use a transitive-dependency and this one is vulnerable to context clash
import { useTheme } from "next-themes"
import { Select } from "@base-ui-components/react/select"
import { useMounted } from "nextra/hooks"

import MoonIcon from "@/app/conf/_design-system/pixelarticons/moon.svg?svgr"
import SunIcon from "@/app/conf/_design-system/pixelarticons/sun.svg?svgr"
import SystemIcon from "@/app/conf/_design-system/pixelarticons/system.svg?svgr"

const THEME_OPTIONS = ["light", "dark", "system"] as const
export type ThemeOption = (typeof THEME_OPTIONS)[number]

const OPTION_ICONS = {
  light: SunIcon,
  dark: MoonIcon,
  system: SystemIcon,
} as const

const isThemeOption = (value: unknown): value is ThemeOption =>
  value === "light" || value === "dark" || value === "system"

export interface ThemeSwitchProps {
  lite?: boolean
  className?: string
}

export function ThemeSwitch({ lite, className }: ThemeSwitchProps) {
  const { setTheme, resolvedTheme, theme } = useTheme()
  const mounted = useMounted()

  const selectedTheme = isThemeOption(theme) ? theme : "light"
  const currentTheme = mounted ? selectedTheme : "light"
  const resolved = mounted && resolvedTheme === "dark" ? "dark" : "light"
  const ResolvedThemeIcon = OPTION_ICONS[resolved]

  return (
    <Select.Root
      value={currentTheme}
      onValueChange={value => {
        if (isThemeOption(value)) {
          setTheme(value)
        }
      }}
    >
      <Select.Trigger
        aria-label="Change theme"
        title="Change theme"
        className={clsx(
          "gql-focus-visible flex items-center gap-2 px-1 text-neu-700 transition-colors hover:text-neu-900 focus-visible:!-outline-offset-2",
          className,
        )}
      >
        <ResolvedThemeIcon height="14" />
        <Select.Value
          className={clsx(
            "text-sm capitalize leading-none",
            lite ? "sr-only" : "text-neu-700",
          )}
        />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className="z-20 outline-none" sideOffset={4}>
          <Select.Popup className="min-w-[var(--anchor-width)] border border-neu-300 bg-[rgb(var(--nextra-bg))] text-neu-900 outline-none">
            <Select.List>
              {THEME_OPTIONS.map(option => {
                const Icon = OPTION_ICONS[option]
                return (
                  <Select.Item
                    key={option}
                    value={option}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-neu-700 outline-none data-[highlighted]:bg-neu-100 data-[highlighted]:text-neu-900 data-[selected]:text-neu-900 dark:data-[highlighted]:bg-neu-50"
                  >
                    <Icon className="size-3.5" />
                    <Select.ItemText className="leading-none">
                      {option}
                    </Select.ItemText>
                  </Select.Item>
                )
              })}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}
