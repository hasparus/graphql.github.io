import CaretDown from "@/app/conf/_design-system/pixelarticons/caret-down.svg?svgr"
import { ChevronRight } from "@/app/conf/_design-system/pixelarticons/chevron-right"

export interface TocHeroContentsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sections: string[]
}

export function TocHeroContents({
  sections: sections,
  ...rest
}: TocHeroContentsProps) {
  return (
    <div
      className="mt-2 w-full max-w-[528px] border border-neu-300 bg-neu-0 dark:border-neu-100 lg:mt-4"
      {...rest}
    >
      <h2 className="typography-body-lg px-4 py-2.5 text-center md:py-4">
        What will you find here?
      </h2>
      <ul className="grid grid-flow-row-dense grid-cols-2 gap-px border-t border-inherit bg-neu-300 dark:bg-neu-100">
        {sections.map((name, i) => (
          <li className="" key={i}>
            <a
              className="flex items-center gap-2 bg-neu-0 p-3 capitalize hover:bg-neu-50 lg:py-5"
              href={`#${name.toLowerCase().replace(/ /g, "-")}`}
            >
              <ChevronRight className="size-4 translate-x-[0.5px]" />
              {name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
