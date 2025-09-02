import { Marker } from 'maplibre-gl'
import { useEffect } from 'react'

const icon = '/map-marker.png'
const iconSize = '40'

export default function useArgileMapMarkers(map, lon, lat) {
  useEffect(() => {
    if (!map) return

    const point = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [lat, lon] },
      properties: {},
    }

    console.log({ point })

    const el = document.createElement('img')
    el.src = icon
    el.style.width = `${iconSize}px`
    el.style.height = `${iconSize}px`
    el.style.cursor = 'pointer'

    const marker = new Marker({ element: el }).setLngLat([lon, lat]).addTo(map)

    const timeoutFunction = () => {
      map.flyTo({ center: [lon, lat], zoom: 10 })
    }
    const timeout = setTimeout(timeoutFunction, 1000)

    return () => {
      marker.remove()
      clearTimeout(timeout)
    }
  }, [map, lat, lon])
}
