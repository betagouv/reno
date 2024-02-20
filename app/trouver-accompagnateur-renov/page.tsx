'use client'

import AddressSearch from '@/components/AddressSearch'
import { Card } from '@/components/UI'
import useSetSeachParams from '@/components/useSetSearchParams'
import { useEffect, useRef, useState } from 'react'
import Entreprise from './Entreprise'
import MapShapes from './MapShape'
import { Loader } from './UI'
import useAddMap from './useAddMap'

export default function CarteMAR({ searchParams }) {
  const [selectedMarker, selectMarker] = useState(null)
  const { codePostal, codeInsee } = searchParams
  const [data, setData] = useState(null)
  const [location, setLocation] = useState(null)
  const mapContainerRef = useRef(null)

  const setSearchParams = useSetSeachParams()

  useEffect(() => {
    if (!codePostal || !codeInsee) return
    const doFetch = async () => {
      const request = await fetch(
        `/trouver-accompagnateur-renov/api?codePostal=${codePostal}&codeInsee=${codeInsee}`,
      )
      const data = await request.json()

      const geolocatedData = await Promise.all(
        data.map(async (el) => {
          const url =
            `https://photon.komoot.io/api/?q=` +
            el.adresse +
            ' ' +
            el.code_postal
          timeout(10)
          const request = await fetch(encodeURI(url))
          const json = await request.json()

          return { ...el, ...(json.features[0] || {}) } // only take the first result for now
        }),
      )
      // We tried doing it on the server side, it failed with 404 not found nginx html messages
      setData(geolocatedData.filter(Boolean))
    }
    doFetch()
  }, [codePostal, codeInsee])

  const map = useAddMap(mapContainerRef, setLocation)

  console.log('olive', data)
  return (
    <div
      css={`
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      `}
    >
      <div
        css={`
          width: 30rem;
          max-width: 90vw;
          ol {
            max-height: 60vh;
            margin: 1rem 0;
            overflow: scroll;
          }
          padding: 0 0.6rem;
        `}
      >
        <AddressSearch
          setChoice={(result) =>
            console.log('olive', result) ||
            setSearchParams({
              codeInsee: result.code,
              codePostal: result.codesPostaux[0],
            })
          }
        />
        {selectedMarker && (
          <Card
            css={`
              margin: 1rem 0;
            `}
          >
            <Entreprise data={selectedMarker} />
          </Card>
        )}
        {data ? (
          <ol>
            {data.map((el) => (
              <li
                key={el.raison_sociale}
                css={`
                  ${selectedMarker?.raison_sociale === el.raison_sociale &&
                  `border: 2px solid var(--color)`}
                `}
              >
                <Entreprise data={el} />
              </li>
            ))}
          </ol>
        ) : !codePostal ? (
          <p>Saisissez votre ville</p>
        ) : (
          <div
            css={`
              margin: 0.6rem;
              display: flex;
              align-items: center;
              p {
                margin: 0;
                padding: 0;
              }
            `}
          >
            <Loader />
            <p>Chargement des données...</p>
          </div>
        )}
      </div>
      <div>
        {map && data?.length && (
          <MapShapes map={map} marList={data} selectMarker={selectMarker} />
        )}
        <div
          ref={mapContainerRef}
          css={`
            height: 60vh;
            max-width: 90vw;
            width: 60rem;
            margin: 0 auto;
          `}
        />
      </div>
    </div>
  )
}
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
