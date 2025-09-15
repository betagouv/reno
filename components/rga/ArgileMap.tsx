import Badge from '@codegouvfr/react-dsfr/Badge'
import Button from '@codegouvfr/react-dsfr/Button'
import { useEffect, useRef, useState } from 'react'
import MapLegend from './MapLegend'
import { fr } from '@codegouvfr/react-dsfr'
import useAddArgileMap from './useAddArgileMap'
import useArgileMapMarkers, {
  useOnPointClick,
  useRnbLayerHoverEffects,
} from './useArgileMapMarkers'
import MapBlock from './MapBlock'

/*
 * Tel que je le comprends pour l'instant, la clef BAN désigne l'adresse.
 * La clef RNB désigne le bâtiment.
 *
 * La clef BAN nous sert à caler la carte, c'est comme une coordonnée, et charger les premières informations BDNB s'il y en a.
 *
 * Au clic sur un bâtiment, l'utilisateur confirme l'id RNB, qui identifie alors sans ambiguité le bâtiment.
 *
 * On part alors pour l'instant du principe que les données fiables et uniques sont celles de la BDNB, que l'utilisateur ne peut pas changer, par simplicité de dev, d'UI, et pour éviter les fraudes.
 * */
export default function ArgileMap({ situation, setChoice }) {
  const [error, setError] = useState()

  const [rnb, setRnb] = useState()
  const [bdnb, setBdnb] = useState(null)
  const data = bdnb && bdnb.length > 0 && bdnb[0] //TODO act on this
  const clefBan = situation['logement . clef ban']?.replace(/"/g, '')

  useEffect(() => {
    if (!rnb) return
    if (situation?.['logement . rnb'] === `"${rnb}"`) {
      return
    }
    async function doFetch() {
      try {
        setBdnb(null)
        // On peut faire un appel à la BDNB sur la base de la clef BAN. On oublie pour l'instant, on prefère que l'utilisateur sélectionne explicitement son bâtiment pour afficher les données de la BDNB
        //const url = `https://api.bdnb.io/v1/bdnb/donnees/batiment_groupe_complet/adresse?cle_interop_adr=eq.${clefBan}`
        const correspondanceUrl = `https://api.bdnb.io/v1/bdnb/donnees/batiment_construction?rnb_id=eq.${rnb}`
        const correspondanceRequest = await fetch(correspondanceUrl)
        const correspondanceJSON = await correspondanceRequest.json()

        const { batiment_groupe_id } = correspondanceJSON[0]
        const url = `https://api.bdnb.io/v1/bdnb/donnees/batiment_groupe_complet?batiment_groupe_id=eq.${batiment_groupe_id}`
        const request = await fetch(url)
        const json = await request.json()
        console.log({ setBdnb: 'oui', json })
        setBdnb(json)

        const firstEntry = json[0]
        if (rnb) setChoice({ ...firstEntry, rnb })
        setError(null)
      } catch (e) {
        console.error(e)
        setError({
          message:
            'Erreur non gérée pendant la récupération des données du bâtiment',
        })
      }
    }
    doFetch()
  }, [setError, rnb, setBdnb, setChoice])

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

  const setSelectedBuilding = (id) => {
    setRnb(id)
  }
  useOnPointClick(map, setSelectedBuilding, rnb)

  console.log({ situation })
  return (
    <div className="fr-fieldset__element">
      <div className="fr-input-group">
        <MapBlock
          {...{
            mapContainerRef,
          }}
        />
        {error && <p className="fr-text--error">{error.message} </p>}
        <section
          css={`
            height: 10rem;
          `}
        >
          {data ? (
            <section
              css={`
                > div {
                  margin-bottom: 0.3rem;
                }
                span {
                  margin-right: 0.6rem;
                }
                width: fit-content;
                animation: flash 1s;
                @keyframes flash {
                  0% {
                    opacity: 0.2;
                    background: #18753c;
                  }
                  100% {
                    opacity: 1;
                    background: none;
                  }
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
                <span>Aléa argiles</span>
                <p className="fr-badge">{data.alea_argiles || 'Nul'}</p>
              </div>
              {data.annee_construction && (
                <div>
                  <span>Année de construction</span>
                  <p className="fr-badge">{data.annee_construction}</p>
                </div>
              )}
              {data.nb_niveau && (
                <div>
                  <span>Niveaux</span>
                  <p className="fr-badge">{data.nb_niveau}</p>
                </div>
              )}
              <div>
                <small
                  css={`
                    color: #aaa;
                  `}
                >
                  Données issues du <a href="https://rnb.beta.gouv.fr/">RNB</a>{' '}
                  et de la <a href="https://bdnb.io/">BDNB</a>
                </small>
              </div>
            </section>
          ) : (
            <p>⏳️ En attente des données du bâtiment...</p>
          )}
        </section>
        {!rnb ? (
          <Button>Sélectionnez votre maison sur la carte</Button>
        ) : (
          <Badge severity="success">Bâtiment sélectionné</Badge>
        )}
      </div>
    </div>
  )
}
