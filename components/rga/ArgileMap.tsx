import { useEffect, useRef, useState } from 'react'
import useAddArgileMap from './useAddArgileMap'
import useArgileMapMarkers, {
  useOnPointClick,
  useRnbLayerHoverEffects,
} from './useArgileMapMarkers'
import MapLegend from './MapLegend'
import Button from '@codegouvfr/react-dsfr/Button'
import Badge from '@codegouvfr/react-dsfr/Badge'

export default function ArgileMap({ situation, setChoice }) {
  const [error, setError] = useState()

  const [bdnb, setBdnb] = useState(null)
  const data = bdnb && bdnb.length > 0 && bdnb[0] //TODO act on this
  const clefBan = situation['logement . clef ban']?.replace(/"/g, '')

  useEffect(() => {
    if (!clefBan) return
    async function doFetch() {
      try {
        const url = `https://api.bdnb.io/v1/bdnb/donnees/batiment_groupe_complet/adresse?cle_interop_adr=eq.${clefBan}`
        const request = await fetch(url)
        const json = await request.json()
        setBdnb(json)
        setError(null)
      } catch (e) {
        console.error(e)
        setError({
          message: 'Erreur pendant la récupération des données du bâtiment',
        })
      }
    }
    doFetch()
  }, [clefBan, setError])

  console.log({ bdnb, clefBan })

  const mapContainerRef = useRef(null)

  const map = useAddArgileMap(mapContainerRef)

  const { 'logement . coordonnees': coordinatesRaw } = situation,
    [lat, lon] = coordinatesRaw
      .replace(/\"/g, '')
      .split(',')
      .map((coordinate) => +coordinate)

  useArgileMapMarkers(map, lon, lat)
  useRnbLayerHoverEffects(map)

  const [rnb, setRnb] = useState()
  const setSelectedBuilding = (id) => {
    setChoice({ ...data, rnb: id })
    setRnb(id)
  }
  useOnPointClick(map, setSelectedBuilding, rnb)

  console.log({ situation })
  return (
    <div className="fr-fieldset__element">
      <div className="fr-input-group">
        {error && <p className="fr-text--error">{error.message} </p>}
        {data ? (
          <section
            css={`
              > div {
                margin-bottom: 0.3rem;
              }
              span {
                margin-right: 0.6rem;
              }
            `}
          >
            <div>
              <span>Adresse</span>
              <p className="fr-badge">
                {situation['logement . adresse'].replace(/"/g, '')}
              </p>
            </div>
            <div>
              <span>Niveau d'aléa argiles</span>
              <p className="fr-badge">{data.alea_argiles || 'Nul'}</p>
            </div>
            {data.annee_construction && (
              <div>
                <span>Année de construction</span>
                <p className="fr-badge">{data.annee_construction}</p>
              </div>
            )}
          </section>
        ) : (
          <p>⏳️ En attente des données du bâtiment...</p>
        )}
        {!rnb ? (
          <Button>Sélectionnez votre maison sur la carte</Button>
        ) : (
          <Badge severity="success">Bâtiment sélectionné</Badge>
        )}
        <div
          ref={mapContainerRef}
          css={`
            margin-top: 1rem;
            width: 100%;
            min-height: 500px;
            height: 100%;
            border-radius: 0.3rem;
          `}
        />
        <MapLegend />
      </div>
    </div>
  )
}
