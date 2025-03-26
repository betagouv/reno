import { useEffect } from 'react'
import { Marker, LngLatBounds } from 'maplibre-gl'
import { getCoproId } from './CoproAddressSearch'

const iconSize = '30'
export default function MapMarkers({
  map,
  data,
  selectMarker,
  icon = 'map-marker.png',
  selected,
}) {
  const selectedId = getCoproId(selected)
  console.log('selected', getCoproId(selected))
  useEffect(() => {
    if (!data.length || !map) return
    const bounds = new LngLatBounds()
    const markers = data
      .filter((feature) => feature.geometry)
      .map((feature, i) => {
        // create a DOM element for the marker
        const el = document.createElement('div')
        el.className = 'marker'
        el.style.backgroundImage = `url(/${icon})`
        el.style.width = `${iconSize}px`
        el.style.height = `${iconSize}px`
        el.style.cursor = 'pointer'
        el.style.position = 'absolute'

        el.style.filter =
          selectedId && selectedId === getCoproId(feature)
            ? 'invert(1)'
            : 'invert(0)'
        el.innerHTML = `<div style="position: absolute;   top: -0.7rem;   right: -0.5rem;   font-weight: bold;   background: var(--color);   color: white;   border-radius: 30px;   width: 1.2rem;   text-align: center;   height: 1.2rem;   line-height: 1.2rem;   border: 2px solid white; ">${i + 1}</div>`

        el.addEventListener('click', () => {
          selectMarker(feature)
        })

        const marker = new Marker({ element: el })
          .setLngLat(feature.geometry.coordinates)
          .addTo(map)

        bounds.extend(feature.geometry.coordinates)
        return marker
      })

    map.fitBounds(bounds, { maxZoom: 17 })
    return () => {
      markers.map((marker) => marker.remove())
    }
  }, [map, data, selectedId])
  return <div></div>
}
