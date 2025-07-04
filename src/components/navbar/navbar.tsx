import { MenuItem, Menu, MenuButton, MenuItems } from "@headlessui/react"
import cn from "clsx"
// eslint-disable-next-line no-restricted-imports -- since we don't need newWindow prop
import NextLink from "next/link"
import { Button } from "nextra/components"
import { useFSRoute } from "nextra/hooks"
import type * as normalizePages from "nextra/normalize-pages"
import type { ReactElement, ReactNode } from "react"
import { useMenu, useThemeConfig } from "nextra-theme-docs"
import { Anchor } from "@/app/conf/_design-system/anchor"
import { renderComponent } from "@/components/utils"

import MenuIcon from "@/app/conf/_design-system/pixelarticons/menu.svg?svgr"
import CloseIcon from "@/app/conf/_design-system/pixelarticons/close.svg?svgr"

type Item = normalizePages.PageItem | normalizePages.MenuItem
export interface NavBarProps {
  items: Item[]
}

const classes = {
  link: cn(
    "_text-sm contrast-more:_text-gray-700 contrast-more:dark:_text-gray-100",
  ),
  active: cn("_font-medium _subpixel-antialiased"),
  inactive: cn(
    "_text-gray-600 hover:_text-gray-800 dark:_text-gray-400 dark:hover:_text-gray-200",
  ),
}

function NavbarMenu({
  menu,
  children,
}: {
  menu: normalizePages.MenuItem
  children: ReactNode
}): ReactElement {
  const routes = Object.fromEntries(
    (menu.children || []).map(route => [route.name, route]),
  )
  return (
    <Menu>
      <MenuButton
        className={({ focus }) =>
          cn(
            classes.link,
            classes.inactive,
            "max-md:_hidden _items-center _whitespace-nowrap _flex _gap-1.5 _ring-inset",
            focus && "nextra-focusable",
          )
        }
      >
        {children}
        {"->"}
      </MenuButton>
      <MenuItems
        transition
        className={({ open }) =>
          cn(
            "motion-reduce:_transition-none",
            "nextra-focus",
            open ? "_opacity-100" : "_opacity-0",
            "nextra-scrollbar _transition-opacity",
            "_border _border-black/5 dark:_border-white/20",
            "_backdrop-blur-lg bg-[rgb(var(--nextra-bg),.8)]", // todo: full screen overlay
            "_z-20 _rounded-md _py-1 _text-sm",
            // headlessui adds max-height as style, use !important to override
            "!_max-h-[min(calc(100vh-5rem),256px)]",
          )
        }
        anchor={{ to: "top end", gap: 10, padding: 16 }}
      >
        {Object.entries(menu.items || {}).map(([key, item]) => (
          <MenuItem
            key={key}
            as={Anchor}
            href={item.href || routes[key]?.route}
          >
            <Anchor
              href={item.href || routes[key]?.route}
              className="data-focus:text-gray-900 block py-1.5 pl-3 pr-9 transition-colors rtl:pl-9 rtl:pr-3"
              target={item.newWindow ? "_blank" : undefined}
            >
              {item.title}
            </Anchor>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}

export function Navbar({ items }: NavBarProps): ReactElement {
  const themeConfig = useThemeConfig()

  const activeRoute = useFSRoute()
  const { menu, setMenu } = useMenu()

  return (
    <div className="nextra-nav-container _top-0 _z-20 _w-full _bg-transparent print:_hidden fixed">
      <div className="nextra-nav-container-blur" />
      <nav className="mx-auto flex h-[var(--nextra-navbar-height)] max-w-[90rem] items-center justify-end gap-4 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]">
        {themeConfig.logoLink ? (
          <NextLink
            href={
              typeof themeConfig.logoLink === "string"
                ? themeConfig.logoLink
                : "/"
            }
            className="nextra-focus flex items-center hover:opacity-75 ltr:mr-auto rtl:ml-auto"
          >
            {renderComponent(themeConfig.logo)}
          </NextLink>
        ) : (
          <div className="flex items-center ltr:mr-auto rtl:ml-auto">
            {renderComponent(themeConfig.logo)}
          </div>
        )}
        <div className="nextra-scrollbar flex gap-4 overflow-x-auto py-1.5">
          {items.map(pageOrMenu => {
            if (pageOrMenu.display === "hidden") return null

            if (pageOrMenu.type === "menu") {
              const menu = pageOrMenu as normalizePages.MenuItem
              return (
                <NavbarMenu key={menu.title} menu={menu}>
                  {menu.title}
                </NavbarMenu>
              )
            }
            const page = pageOrMenu as normalizePages.PageItem
            let href = page.href || page.route || "#"

            // If it's a directory
            if (page.children) {
              href =
                (page.withIndexPage ? page.route : page.firstChildRoute) || href
            }

            const isActive =
              page.route === activeRoute ||
              activeRoute.startsWith(page.route + "/")

            return (
              <Anchor
                href={href}
                key={href}
                className={cn(
                  classes.link,
                  "max-md:_hidden _whitespace-nowrap _ring-inset",
                  !isActive || page.newWindow
                    ? classes.inactive
                    : classes.active,
                )}
                target={page.newWindow ? "_blank" : undefined}
                aria-current={!page.newWindow && isActive}
              >
                {page.title}
              </Anchor>
            )
          })}
        </div>

        {process.env.NEXTRA_SEARCH &&
          renderComponent(themeConfig.search.component, {
            className: "max-md:_hidden",
          })}

        {themeConfig.project.link ? (
          <Anchor href={themeConfig.project.link}>
            {renderComponent(themeConfig.project.icon)}
          </Anchor>
        ) : null}

        {themeConfig.chat.link ? (
          <Anchor href={themeConfig.chat.link}>
            {renderComponent(themeConfig.chat.icon)}
          </Anchor>
        ) : null}

        {renderComponent(themeConfig.navbar.extraContent)}

        <Button
          aria-label="Menu"
          className={({ active }) =>
            cn(
              "nextra-hamburger _rounded md:_hidden",
              active && "_bg-gray-400/20",
            )
          }
          onClick={() => setMenu(!menu)}
        >
          {menu ? <CloseIcon /> : <MenuIcon />}
        </Button>
      </nav>
    </div>
  )
}
