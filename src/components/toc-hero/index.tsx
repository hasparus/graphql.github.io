export { TocHeroContents } from "./toc-hero-contents"

export interface TocHeroProps {
  heading: string
  text: React.ReactNode
  children: React.ReactNode
  decoration: React.ReactNode
}
export function TocHero({ heading, text, children, decoration }: TocHeroProps) {
  return (
    <section className="relative bg-neu-0 pt-[calc(var(--nextra-navbar-height)+18px)]">
      {decoration}
      <div className="gql-section gql-container relative flex !max-w-screen-lg flex-col items-center gap-6 text-center lg:gap-8">
        <h1 className="typography-h1">{heading}</h1>
        <p className="typography-body-sm max-w-[80vw] text-pretty">{text}</p>
        {children}
      </div>
    </section>
  )
}
