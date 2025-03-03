import { useEffect } from 'react'
import { Marker, LngLatBounds } from 'maplibre-gl'

const iconSize = '30'
export default function MapMarkers({
  map,
  data,
  selectMarker,
  icon = 'map-marker.png',
}) {
  useEffect(() => {
    if (!data.length) return
    const bounds = new LngLatBounds()
    const markers = data
      .filter((feature) => feature.geometry)
      .map((feature) => {
        // create a DOM element for the marker
        const el = document.createElement('div')
        el.className = 'marker'
        el.style.backgroundImage = `url(/${icon})`
        el.style.width = `${iconSize}px`
        el.style.height = `${iconSize}px`

        el.addEventListener('click', () => {
          selectMarker(feature)
        })

        const coordinates = [feature.geometry.coordinates].reverse()
        const marker = new Marker({ element: el })
          .setLngLat(coordinates)
          .addTo(map)

        bounds.extend(coordinates)
        return marker
      })

    map.fitBounds(bounds, { maxZoom: 12 })
    return () => {
      markers.map((marker) => marker.remove())
    }
  }, [map, data])
  return <div></div>
}
