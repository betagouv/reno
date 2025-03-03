import { useEffect } from 'react'
import { Marker, LngLatBounds } from 'maplibre-gl'

export default function MapMarkers({ map, data, selectMarker }) {
  useEffect(() => {
    const bounds = new LngLatBounds()
    const markers = data
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
  }, [map, data])
  return <div></div>
}
