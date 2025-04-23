'use client'
import dpeColors from '@/components/dpe/DPE.yaml'
import { useEffect, useRef, useState } from 'react'
import MapMarkers from '../AddressSearchMapMarkers'
import useAddAddressMap from '../useAddAddressMap'
import DPEMarkers from './DPEMarkers'

export default function DPEMap({ searchParams, onSelectDpe, dpe }) {
  const [dpes, setDpes] = useState()
  const [error, setError] = useState()

  const mapContainerRef = useRef(null)
  const map = useAddAddressMap(mapContainerRef)
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    const [lat, lon] = dpe['_geopoint'].split(',').map((e) => parseFloat(e))
    async function fetchDPE() {
      try {
        const request = await fetch(
          `https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/lines?geo_distance=${lon}%3A${lat}%3A3000&size=100`,
        )
        const json = await request.json()
        // On créé une propriété dpe.geometry.coordinates car c'est le format attendu par le MapMarkers
        // aussi utilisé par le module copro, donc je ne veux pas le toucher
        setDpes(
          json.results.map((dpe) => ({
            ...dpe,
            geometry: { coordinates: dpe['_geopoint'].split(',').reverse() },
          })),
        )
        setError(null)
      } catch (e) {
        console.error(e)
        setError({ message: 'Erreur pendant la récupération des DPEs' })
      }
    }
    fetchDPE()
  }, [setDpes, dpe, setError])

  return (
    <div>
      {map && (
        <>
          <MapMarkers map={map} data={[dpes[0]]} selectMarker={setClicked} />
          <DPEMarkers
            map={map}
            featureCollection={{
              type: 'FeatureCollection',
              features: dpes?.map((dpe) => {
                const { n_etage_appartement: etage, etiquette_dpe: etiquette } =
                  dpe
                const [lon, lat] = dpe.geometry.coordinates

                const color = dpeColors.find(
                  (dpe) => dpe.lettre === etiquette,
                ).couleur
                const fakeFloor = Math.round(Math.random() * 6)

                return {
                  type: 'Feature',
                  geometry: {
                    coordinates: [+lon, +lat],
                    type: 'Point',
                  },
                  properties: {
                    ...dpe,
                    etage: +etage,
                    top: (fakeFloor + 1) * 3,
                    base: fakeFloor * 3,
                    height: 3,
                    etiquette,
                    surface: +dpe['surface_habitable_logement'],
                    color,
                  },
                }
              }),
            }}
            selectMarker={(feature) => {
              onSelectDpe?.(feature)
            }}
          />
        </>
      )}
      <div
        ref={mapContainerRef}
        css={`
          width: 100%;
          min-height: 400px;
          height: 100%;
          border-radius: 0.3rem;
        `}
      />
    </div>
  )
}
