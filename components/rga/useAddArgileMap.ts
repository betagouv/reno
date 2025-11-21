import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useState } from 'react'
import getAppUrl from '@/components/getAppUrl'
import { Protocol } from 'pmtiles'

const defaultCenter = [1.86, 46.67]
export const defaultZoom = 4.8
const maxBoundsHexagone = [
  [-6, 41], // Southwest coordinates
  [9.5, 52], // Northeast coordinates
]

export default function useAddAddressMap(mapContainerRef) {
  const [map, setMap] = useState(null)

  useEffect(() => {
    let protocol = new Protocol()
    maplibregl.addProtocol('pmtiles', protocol.tile)
    return () => {
      maplibregl.removeProtocol('pmtiles')
    }
  }, [])

  useEffect(() => {
    if (!mapContainerRef.current) return undefined

    const url = getAppUrl() + `/style-carte-argile.json`

    console.log({ url })
    const newMap = new maplibregl.Map({
      container: mapContainerRef.current,
      style: url,
      center: defaultCenter,
      zoom: defaultZoom,
      hash: true,
      maxBounds: maxBoundsHexagone,
    })
    newMap.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
        showZoom: true,
        showCompass: true,
      }),
      'top-right',
    )

    newMap.on('style.load', function () {
      console.log('ONLOAD STYLE', newMap._mapId)
    })
    newMap.on('load', () => {
      console.log('ONLOAD', newMap._mapId)
      setMap(newMap)
    })

    return () => {
      setMap(null)
      newMap?.remove()
    }
  }, [setMap, mapContainerRef]) // styleUrl not listed on purpose

  return map
}
