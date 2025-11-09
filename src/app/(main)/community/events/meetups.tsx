import { useEffect, useRef } from "react"

import "leaflet/dist/leaflet.css"
import { EventsScrollview } from "./events-scrollview"
import { meetups } from "../../../../components/meetups"
import { EventCard } from "./event-card"

import pinkCircle from "./pink-circle.svg"

export function Meetups() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import("leaflet").Map>()
  const loadingTokenRef = useRef<symbol>()

  useEffect(() => {
    if (mapRef.current) return
    const loadingToken = (loadingTokenRef.current = Symbol())
    ;(async function loadMap() {
      if (!mapContainer.current) return
      const Leaflet = await import("leaflet")

      if (loadingToken !== loadingTokenRef.current) {
        return
      }

      // Fixes GET http://localhost:3000/community/upcoming-events/marker-icon-2x.png 404 (Not Found)
      // and replace default marker image
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: pinkCircle.src,
        shadowUrl: "",
      })

      const map = Leaflet.map(mapContainer.current).setView([45, -15], 2)
      mapRef.current = map

      Leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        map,
      )

      for (const { node } of meetups) {
        Leaflet.marker([node.latitude, node.longitude])
          .addTo(map)
          .bindPopup(
            `<a href="${node.link}" target="_blank" rel="noreferrer" class="!text-primary">${node.name}</a>`,
          )
      }
    })()

    return () => {
      if (mapRef.current) mapRef.current.remove()
      mapRef.current = undefined
    }
  }, [])
  return (
    <>
      <div ref={mapContainer} className="z-0 my-6 h-96" />
      <EventsScrollview>
        {meetups.map(({ node }) => (
          <EventCard
            key={node.id}
            href={node.link}
            name={node.name}
            city={node.city + ", " + node.country}
            official={node.official}
            date={node.next || node.prev}
          />
        ))}
      </EventsScrollview>
    </>
  )
}
