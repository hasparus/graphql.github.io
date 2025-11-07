import { useEffect } from "react"

import "leaflet/dist/leaflet.css"
import { EventsScrollview } from "./events-scrollview"
import { meetups } from "../../../../components/meetups"
import { EventCard } from "./event-card"

import pinkCircle from "./pink-cirle.svg"

export function Meetups() {
  useEffect(() => {
    // Load only on client
    import("leaflet").then(L => {
      // Fixes GET http://localhost:3000/community/upcoming-events/marker-icon-2x.png 404 (Not Found)
      // and replace default marker image
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: pinkCircle.src,
        shadowUrl: "",
      })
      const map = L.map("map").setView([45, -15], 2)
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)
      for (const { node } of meetups) {
        L.marker([node.latitude, node.longitude])
          .addTo(map)
          .bindPopup(
            `<a href="${node.link}" target="_blank" rel="noreferrer" class="!text-primary">${node.name}</a>`,
          )
      }
    })
  }, [])
  return (
    <>
      <div id="map" className="z-0 my-6 h-96" />
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
