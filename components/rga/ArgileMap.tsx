import { useEffect, useRef, useState } from 'react'
import ChosenBuildingInfo from './ChosenBuildingInfo'
import MapBlock from './MapBlock'
import useAddArgileMap from './useAddArgileMap'
import useArgileMapMarkers, {
  useOnPointClick,
  useRnbLayerHoverEffects,
} from './useArgileMapMarkers'

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
    if (situation?.['logement . rnb'] === `"${rnb.id}"`) {
      return
    }
    async function doFetch() {
      try {
        setBdnb(null)
        // On peut faire un appel à la BDNB sur la base de la clef BAN. On oublie pour l'instant, on prefère que l'utilisateur sélectionne explicitement son bâtiment pour afficher les données de la BDNB
        //const url = `https://api.bdnb.io/v1/bdnb/donnees/batiment_groupe_complet/adresse?cle_interop_adr=eq.${clefBan}`
        const correspondanceUrl = `https://api.bdnb.io/v1/bdnb/donnees/batiment_construction?rnb_id=eq.${rnb.id}`
        const correspondanceRequest = await fetch(correspondanceUrl)
        const correspondanceJSON = await correspondanceRequest.json()

        const { batiment_groupe_id } = correspondanceJSON[0]
        const url = `https://api.bdnb.io/v1/bdnb/donnees/batiment_groupe_complet?batiment_groupe_id=eq.${batiment_groupe_id}`
        const request = await fetch(url)
        const json = await request.json()
        console.log({ setBdnb: 'oui', json })
        setBdnb(json)

        const firstEntry = json[0]
        if (rnb) setChoice({ ...firstEntry, rnbId: rnb.id })
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
  }, [setError, rnb?.id, setBdnb, setChoice])

  console.log({ bdnb, clefBan })

  const mapContainerRef = useRef(null)

  const map = useAddArgileMap(mapContainerRef)

  const { 'logement . coordonnees': coordinatesRaw } = situation,
    [lat, lon] = coordinatesRaw
      ? coordinatesRaw
          .replace(/\"/g, '')
          .split(',')
          .map((coordinate) => +coordinate)
      : [null, null]

  useArgileMapMarkers(map, lon, lat)
  useRnbLayerHoverEffects(map)

  const setSelectedBuilding = (rnb) => {
    setRnb(rnb)
  }
  useOnPointClick(map, setSelectedBuilding, rnb?.id)

  console.log({ situation })
  return (
    <div className="fr-fieldset__element">
      <div className="fr-input-group">
        {error && <p className="fr-text--error">{error.message} </p>}
        <div
          css={`
            display: flex;
            gap: 2rem;
            @media (width <= 800px) {
              flex-direction: column;
            }
          `}
        >
          <MapBlock
            {...{
              mapContainerRef,
              rnb: rnb.id,
            }}
          />
          {data ? <ChosenBuildingInfo {...{ situation, data }} /> : null}
        </div>
      </div>
    </div>
  )
}
