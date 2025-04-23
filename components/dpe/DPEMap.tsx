'use client'
import dpeColors from '@/components/dpe/DPE.yaml'
import { useCallback, useEffect, useRef, useState } from 'react'
import MapMarkers from '../AddressSearchMapMarkers'
import useAddAddressMap from '../useAddAddressMap'
import { computeBbox } from '../geoUtils'
import DPEMarkers from './DPEMarkers'

export default function DPEMap({ searchParams, onSelectDpe, dpe }) {
  const [results, setResults] = useState(null)
  const [dpes, setDpes] = useState([dpe])
  const [error, setError] = useState()

  const mapContainerRef = useRef(null)
  const setLocation = useCallback(
    (location) => console.log('location', location),
    [],
  )

  const active = results?.length > 0
  const map = useAddAddressMap(mapContainerRef, setLocation, active)

  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    if (!clicked) return

    const [lat, lon] = clicked.geometry.coordinates
    async function fetchDPE() {
      try {
        const url = `https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/lines?bbox=${computeBbox({ lat, lon, factor: 20 })}`

        const request = await fetch(url)
        const json = await request.json()
        setDpes(json.results)
        console.log('results', json.results)
        setError(null)
      } catch (e) {
        console.error(e)
        setError({ message: 'Erreur pendant la récupération des DPEs' })
      }
    }
    fetchDPE()
  }, [clicked, setDpes, setError])

  return (
    <div>
      {map && (
        <>
          <MapMarkers map={map} data={results} selectMarker={setClicked} />
          <DPEMarkers
            map={map}
            featureCollection={{
              type: 'FeatureCollection',

              features: dpes?.map((dpe) => {
                const {
                  _geopoint: geopoint,
                  n_etage_appartement: etage,
                  etiquette_dpe: etiquette,
                } = dpe

                const [lat, lon] = geopoint.split(',')

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
