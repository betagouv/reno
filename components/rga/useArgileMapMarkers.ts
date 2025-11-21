import { Marker } from 'maplibre-gl'
import { useEffect } from 'react'

const icon = '/map-marker.png'
const iconSize = '40'

export default function useArgileMapMarkers(map, lon, lat) {
  useEffect(() => {
    if (!map) return
    if (!lon || !lat) return

    const point = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [lat, lon] },
      properties: {},
    }

    const el = document.createElement('img')
    el.src = icon
    el.style.width = `${iconSize}px`
    el.style.height = `${iconSize}px`
    el.style.cursor = 'pointer'

    const marker = new Marker({ element: el }).setLngLat([lon, lat]).addTo(map)

    const timeoutFunction = () => {
      map.flyTo({ center: [lon, lat], zoom: 17 })
    }
    const timeout = setTimeout(timeoutFunction, 1000)

    return () => {
      marker.remove()
      clearTimeout(timeout)
    }
  }, [map, lat, lon])
}

const pointsLayerId = 'points RNB',
  pointsSourceId = 'rnb-points'

const formsLayerId = 'formes RNB',
  formsSourceId = 'rnb-formes'
let hoveredStateId = null

export function useOnPointClick(map, setSelectedBuilding, rnb) {
  useEffect(() => {
    if (!map) return
    const onClick = (e) => {
      const feature = e.features[0]
      console.log('click features', e.features)
      const { id } = feature

      const { lat, lng } = e.lngLat

      if (rnb) {
        map.setFeatureState(
          {
            source: pointsSourceId,
            sourceLayer: 'default',
            id: rnb,
          },
          { selected: undefined },
        )
        map.setFeatureState(
          {
            source: formsSourceId,
            sourceLayer: 'default',
            id: rnb,
          },
          { selected: undefined },
        )
      }

      map.setFeatureState(
        {
          source: pointsSourceId,
          sourceLayer: 'default',
          id,
        },
        { selected: true },
      )

      map.setFeatureState(
        {
          source: formsSourceId,
          sourceLayer: 'default',
          id,
        },
        { selected: true },
      )
      setSelectedBuilding({ id, lat, lon: lng })
    }
    map.on('click', pointsLayerId, onClick)

    map.on('click', formsLayerId, onClick)

    return () => {
      map.off('click', pointsLayerId, onClick)
      map.off('click', formsLayerId, onClick)
    }
  }, [map, setSelectedBuilding, rnb])
}

//https://maplibre.org/maplibre-gl-js/docs/examples/create-a-hover-effect/
export function useRnbLayerHoverEffects(map) {
  useEffect(() => {
    if (!map) return

    const onMouseMove = (e) => {
      if (e.features.length > 0) {
        if (hoveredStateId) {
          map.setFeatureState(
            {
              source: pointsSourceId,
              sourceLayer: 'default',
              id: hoveredStateId,
            },
            { hover: false },
          )
        }

        hoveredStateId = e.features[0].id

        // Set the feature state to "hover"
        map.setFeatureState(
          {
            source: pointsSourceId,
            id: hoveredStateId,
            sourceLayer: 'default',
          },
          { hover: true },
        )
      }
    }

    // When the mouse moves over the map, check if it's over a point
    map.on('mousemove', pointsLayerId, onMouseMove)

    const onMouseLeave = () => {
      if (hoveredStateId) {
        // Reset all feature states for this layer
        map.setFeatureState(
          {
            source: pointsSourceId,
            sourceLayer: 'default',
            id: hoveredStateId,
          },
          { hover: false },
        )
        hoveredStateId = null
      }
    }
    // When the mouse leaves the point, reset the feature state
    map.on('mouseleave', pointsLayerId, onMouseLeave)
    return () => {
      map.off('mousemove', pointsLayerId, onMouseMove)
      map.off('mouseleave', pointsLayerId, onMouseLeave)
    }
  }, [map])
}
