import CaretDown from "@/app/conf/_design-system/pixelarticons/caret-down.svg?svgr"

export interface TocHeroProps {
  heading: string
}
export function TocHero({ heading }: TocHeroProps) {
  return (
    <section className="flex flex-col gap-6 lg:gap-8">
      <h1 className="typography-h1">{heading}</h1>
    </section>
  )
}

export function TocHeroContents({ ids }: { ids: string[] }) {
  return (
    <div className="">
      <h2 className="typography-body-lg px-4 py-2.5 text-center md:py-4">
        What will you find here?
      </h2>
      <ul className="grid grid-flow-row-dense grid-rows-2 gap-px bg-neu-300">
        {ids.map((id, i) => (
          <li className="" key={i}>
            <a
              className="flex gap-3 bg-neu-0 has-[a:hover]:bg-neu-50"
              href={`#${id}`}
            >
              <CaretDown className="size-4 translate-x-[0.5px] -rotate-90" />
              {id}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
