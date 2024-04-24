'use client'

import AddressSearch from '@/components/AddressSearch'
import { Card } from '@/components/UI'
import computeDistance from '@turf/distance'
import { useEffect, useRef, useState } from 'react'
import Entreprise from './Entreprise'
import MapShapes from './MapShape'
import { Loader } from './UI'
import useAddMap from './useAddMap'

export default function MarSearch({
  codeInsee: givenCodeInsee,
  what = 'trouver-accompagnateur-renov',
}) {
  if (what === 'trouver-accompagnateur-renov') return //  Disactivated, we were forbidden to use france-renov.gouv.fr's non documented APIs, and the UI doesn't expose this anymore
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
      const whereClause = encodeURIComponent(
        `startsWith(ancien_code_pivot, 'fr_renov-${codeInsee}')`,
      )
      const request = await fetch(
        `https://api-lannuaire.service-public.fr/api/explore/v2.1/catalog/datasets/api-lannuaire-administration/records?where=${whereClause}`,
      )
      const rawData = await request.json()

      const result = rawData.results[0]

      // We bypass the following geolocation code, per https://github.com/betagouv/reno/issues/74#issuecomment-2036347206
      return setData([result])

      // Temporary, should be done once properly in the form, maybe with the exact adress to find the closest MAR
      const coordinatesRequest = await fetch(
        `https://geo.api.gouv.fr/communes?code=${codeInsee}&format=geojson`,
      )
      const coordinates = await coordinatesRequest.json()

      const geolocatedData = await Promise.all(
        data
          .map(async (el) => {
            const address = getAdresse(el)
            if (!address) return false
            const url = `https://photon.komoot.io/api/?q=` + address.join(' ')
            timeout(10)
            const request = await fetch(encodeURI(url))
            const json = await request.json()

            return { ...el, ...(json.features[0] || {}) } // only take the first result for now
          })
          .filter(Boolean),
      )
      const plainData = geolocatedData.filter(Boolean)
      const centre = coordinates?.features[0]
      if (!centre) return setData(plainData)

      const hasGeo = plainData.filter((el) => el.geometry?.coordinates)
      const closeEnough = hasGeo
        .map((el) => {
          const distance = computeDistance(centre, el)
          console.log('red', distance, centre, el)
          return { ...el, properties: { ...el.properties, distance } }
        })
        .filter(({ properties: { distance } }) => distance < 200)
        .sort((a, b) => a.properties.distance > b.properties.distance)

      console.log('indigo', plainData.length, hasGeo.length, closeEnough.length)
      // We tried doing it on the server side, it failed with 404 not found nginx html messages
      setData(closeEnough)
    }
    doFetch()
  }, [codeInsee])

  // Map disactivated per https://github.com/betagouv/reno/issues/74#issuecomment-2036347206
  //const map = useAddMap(mapContainerRef, setLocation)

  return (
    <div
      css={`
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
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
        <div
          css={`
            margin: auto;
            margin-right: 0;
          `}
        >
          <small>
            Recherche pour votre code Insee {codeInsee}.{' '}
            <button onClick={() => setLocalCodeInsee(null)}>Changer</button>
          </small>
        </div>
      )}
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
          <section>
            {data.length === 1 ? (
              <section>
                <h3>Votre conseiller : </h3>
                <br />

                <Entreprise data={data[0]} />
              </section>
            ) : (
              <div>
                <ol
                  css={`
                    padding: 0 1.2rem;
                    margin-bottom: 0 !important;
                  `}
                >
                  {data.map((el) => (
                    <li
                      key={el.raison_sociale}
                      css={`
                        margin: 1rem 0;
                        ${selectedMarker?.raison_sociale ===
                          el.raison_sociale && `border: 2px solid var(--color)`}
                      `}
                    >
                      <Entreprise data={el} />
                    </li>
                  ))}
                </ol>
                <div
                  css={`
                    width: 100%;
                    height: 1px;
                    background: grey;
                    box-shadow: 0 4px 6px -6px #222;
                  `}
                />
              </div>
            )}
          </section>
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
      {false && (
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
      )}
    </div>
  )
}
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const getAdresse = (obj) => {
  console.log('cyan addios', obj.adresse)
  if (obj.adresse) {
    try {
      const adresses = JSON.parse(obj.adresse)

      const {
        complement1,
        complement2,
        numero_voie,
        code_postal,
        nom_commune,
      } = adresses[0]
      return [
        `${complement1 || ''} ${complement2 || ''}`,
        `${numero_voie}`,
        `${code_postal} ${nom_commune}`,
      ]
    } catch (e) {
      console.log(`Erreur de parsing de l'addresse`, obj)
      return ['Adresse inconnue', null]
    }
  }

  return ['Adresse inconnue', null]
}
