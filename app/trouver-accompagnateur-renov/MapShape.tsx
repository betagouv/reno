import { useEffect } from 'react'
import { Marker } from 'maplibre-gl'

export default function MapShapes({ map, marList }) {
  console.log('olive', marList)
  useEffect(() => {
    marList.filter(Boolean).map((el) => {
      const marker = new Marker().setLngLat(el.geometry.coordinates).addTo(map)
      return marker
    })
  }, [map, marList])
  return <div></div>
}
