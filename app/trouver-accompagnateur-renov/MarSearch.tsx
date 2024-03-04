'use client'

import AddressSearch from '@/components/AddressSearch'
import { Card } from '@/components/UI'
import computeDistance from '@turf/distance'
import { useEffect, useRef, useState } from 'react'
import Entreprise from './Entreprise'
import MapShapes from './MapShape'
import { Loader } from './UI'
import useAddMap from './useAddMap'

export default function MarSearch({ codeInsee: givenCodeInsee }) {
  const [selectedMarker, selectMarker] = useState(null)
  const [data, setData] = useState(null)
  const [location, setLocation] = useState(null)
  const mapContainerRef = useRef(null)
  const [localCodeInsee, setLocalCodeInsee] = useState(undefined)

  const codeInsee =
    localCodeInsee === undefined ? givenCodeInsee : localCodeInsee

  useEffect(() => {
    if (!codeInsee) return
    const doFetch = async () => {
      const request = await fetch(
        `/trouver-accompagnateur-renov/api?codeInsee=${codeInsee}`,
      )
      const data = await request.json()

      // Temporary, should be done once properly in the form, maybe with the exact adress to find the closest MAR
      const coordinatesRequest = await fetch(
        `https://geo.api.gouv.fr/communes?code=${codeInsee}&format=geojson`,
      )
      const coordinates = await coordinatesRequest.json()

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
      const plainData = geolocatedData.filter(Boolean)
      const centre = coordinates?.features[0]
      if (!centre) return setData(plainData)

      const filtered = plainData.filter((el) => {
        const distance = computeDistance(centre, el)
        console.log('red', distance, centre, el)
        return distance < 200
      })
      // We tried doing it on the server side, it failed with 404 not found nginx html messages
      setData(filtered)
    }
    doFetch()
  }, [codeInsee])

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
          margin: 1rem;
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
        {!codeInsee ? (
          <label
            css={`
              display: flex;
              align-items: center;
              span {
                margin-right: 1rem;
              }
            `}
          >
            <span>Saisissez votre ville</span>
            <AddressSearch
              setChoice={(result) => {
                setData(null)

                setLocalCodeInsee('' + result.code)
              }}
            />
          </label>
        ) : (
          <div>
            Recherche pour votre code Insee {codeInsee}.{' '}
            <button onClick={() => setLocalCodeInsee(null)}>
              Rechercher ailleurs
            </button>
          </div>
        )}
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
        ) : (
          codeInsee && (
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
          )
        )}
      </div>
      <div
        css={`
          height: 60vh;
          width: 60rem;
          margin: 0 auto;
          max-width: 90%;
        `}
      >
        {map && data?.length && (
          <MapShapes map={map} marList={data} selectMarker={selectMarker} />
        )}
        <div
          ref={mapContainerRef}
          css={`
            width: 100%;
            height: 100%;
          `}
        />
      </div>
    </div>
  )
}
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
