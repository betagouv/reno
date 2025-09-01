import { useEffect } from 'react'
import { Marker, LngLatBounds } from 'maplibre-gl'

export default function MapShapes({ map, marList, selectMarker }) {
  useEffect(() => {
    const bounds = new LngLatBounds()
    const markers = marList
      .filter((el) => el.geometry)
      .map((el) => {
        const marker = new Marker()
          .setLngLat(el.geometry.coordinates)
          .addTo(map)
        marker.getElement().addEventListener('click', () => selectMarker(el))
        bounds.extend(el.geometry.coordinates)
        return marker
      })

    map.fitBounds(bounds, { maxZoom: 12 })
    return () => {
      markers.map((marker) => marker.remove())
    }
  }, [map, marList])
  return <div></div>
}
