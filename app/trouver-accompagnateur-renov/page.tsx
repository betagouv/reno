'use client'

import AddressSearch from '@/components/AddressSearch'
import useSetSeachParams from '@/components/useSetSearchParams'
import { useEffect, useRef, useState } from 'react'
import MapShapes from './MapShape'
import useAddMap from './useAddMap'

export default function CarteMAR({ searchParams }) {
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
      `}
    >
      <div
        css={`
          width: 30rem;
          max-width: 90vw;
          ol {
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
        {data ? (
          <ol>
            {data.map((el) => (
              <li key={el.raison_sociale}>
                <div>
                  <strong>{el.raison_sociale}</strong>
                </div>
                <small>
                  {el.adresse} {el.ville}
                </small>
                <div>
                  <a
                    href={`tel:${el.tel}`}
                    title="Contacter cette entreprise par téléphone"
                  >
                    {el.tel}
                  </a>
                </div>
                <div>
                  <a
                    href={`mailto:${el.email}`}
                    title="Contacter cette entreprise par courriel"
                  >
                    {el.email}
                  </a>
                </div>
              </li>
            ))}
          </ol>
        ) : !codePostal ? (
          <p>Saisissez votre ville</p>
        ) : (
          <p>Chargement des données...</p>
        )}
      </div>
      <div>
        {map && data?.length && <MapShapes map={map} marList={data} />}
        <div
          ref={mapContainerRef}
          css={`
            height: 60vh;
            width: 60vw;
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
