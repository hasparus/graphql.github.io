import React from "react"

type InfoGridProps = {
  title: string
  subtitle: string
  id?: string
  listItems: { title: string; description: string }[]
}

export const InfoGrid: React.FC<InfoGridProps> = ({
  title,
  subtitle,
  listItems,
  id,
}) => (
  <section id={id}>
    <h1 className="mb-4 typography-h2">{title}</h1>
    <p className="mb-8 typography-body-lg">{subtitle}</p>

    {/* Horizontal Scrollable Grid */}
    <div
      style={{
        scrollSnapType: "x mandatory",
      }}
      className="scroll-snap-x flex snap-mandatory gap-6 overflow-x-auto lg:grid lg:grid-cols-3 lg:overflow-visible"
    >
      {listItems.map(({ title, description }, index) => (
        <div key={index} className="border border-neu-400 p-3">
          <h2 className="mb-2 typography-body-lg">{title}</h2>
          <p
            className="typography-body-md [&_a]:typography-link"
            dangerouslySetInnerHTML={{ __html: description }}
          ></p>
        </div>
      ))}
    </div>
  </section>
)
