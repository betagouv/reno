import { useEffect } from 'react'
import { Marker, LngLatBounds } from 'maplibre-gl'

export default function MapShapes({ map, marList }) {
  console.log('olive', marList)
  useEffect(() => {
    const bounds = new LngLatBounds()
    marList
      .filter((el) => el.geometry)
      .map((el) => {
        const marker = new Marker()
          .setLngLat(el.geometry.coordinates)
          .addTo(map)
        bounds.extend(el.geometry.coordinates)
        return marker
      })

    map.fitBounds(bounds)
  }, [map, marList])
  return <div></div>
}
