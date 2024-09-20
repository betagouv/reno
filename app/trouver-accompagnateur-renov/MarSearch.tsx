'use client'

import AddressSearch from '@/components/AddressSearch'
import { Card } from '@/components/UI'
import { useEffect, useRef, useState } from 'react'
import Entreprise from './Entreprise'
import MapShapes from './MapShape'
import { Loader } from './UI'
import Entreprises from './Entreprises'

export default function MarSearch({
  codeInsee: givenCodeInsee,
  what = 'trouver-accompagnateur-renov',
}) {
  if (what === 'trouver-accompagnateur-renov') return //  Disactivated, we were forbidden to use france-renov.gouv.fr's non documented APIs, and the UI doesn't expose this anymore
  const [selectedMarker, selectMarker] = useState(null)
  const [data, setData] = useState(null)
  const mapContainerRef = useRef(null)
  const [localCodeInsee, setLocalCodeInsee] = useState(undefined)

  const rawCodeInsee =
    localCodeInsee === undefined ? givenCodeInsee : localCodeInsee

  const codeInsee = rawCodeInsee?.replace(/"/g, '')

  useEffect(() => {
    if (!codeInsee) return
    const doFetch = async () => {

      const request = await fetch(
        `https://data.ademe.fr/data-fair/api/v1/datasets/perimetre-espaces-conseil-france-renov/lines?q=${codeInsee}&q_fields=Code_Insee_Commune`,
      )

      setData((await request.json()).results)
    }
    doFetch()
  }, [codeInsee])

  // Map disactivated per https://github.com/betagouv/reno/issues/74#issuecomment-2036347206
  //const map = useAddMap(mapContainerRef, setLocation)

  return (
    <div
      css={`
        justify-content: center;
        margin-top: 3vh;
        display: flex;
      `}
    >
      {!codeInsee && (
        <>
          <label css={`
            margin-right: 1rem;
            line-height: 2.2rem;
            width: 100%;
          `} htmlFor="ville">Saisissez votre ville</label>
          <AddressSearch
            setChoice={(result) => {
              setData(null)

              setLocalCodeInsee('' + result.code)
            }}
          />
        </>
      )}
      <div
        css={`
          margin: 1rem;
          width: 100%;
          max-width: 90vw;
        `}
      >
        {data == null ? (
           codeInsee && (<MarLoader />)
        ) : (
          <>
            <div css={`text-align: end;`}>
              <small>
                Recherche de conseiller pour votre code Insee {codeInsee}.{' '}
                <button onClick={() => setLocalCodeInsee(null)}>Changer</button>
              </small>
            </div>
            <Entreprises data={data} />
          </>
        )}
        {/*Anciennement utilisé pour afficher la carte avec surlignage des conseillers sélectionnés */}
        {false && selectedMarker && (
          <Card
            css={`
              margin: 1rem 0;
            `}
          >
            <Entreprise data={selectedMarker} />
          </Card>
        )}
        {false &&
          (data ? (
            <section>
              {data.length === 1 ? (
                <section>
                  <h3
                    css={`
                      margin-top: 0;
                      margin-bottom: 0rem;
                    `}
                  >
                    Votre conseiller :{' '}
                  </h3>
                  <br />
                  <Entreprises data={data} />
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
                            el.raison_sociale &&
                          `border: 2px solid var(--color)`}
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
            codeInsee && <MarLoader />
          ))}
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

export const getAdresse = (obj) => {
  if (obj.Adresse_Structure) {
    try {
      return [
        `${obj.Nom_Structure}`,
        `${obj.Adresse_Structure}`,
        `${obj.Code_Postal_Structure} ${obj.Commune_Structure}`,
      ]
    } catch (e) {
      console.log(`Erreur de parsing de l'addresse`, obj)
      return ['Adresse inconnue', null]
    }
  }

  return ['Adresse inconnue', null]
}
const MarLoader = () => (
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
