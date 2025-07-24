import { Loader } from '@/app/trouver-conseiller-france-renov/UI'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useDebounce } from 'use-debounce'
import MapMarkers from './AddressSearchMapMarkers'
import CoproBlock from './CoproBlock'
import DPEMarkers from './dpe/DPEMarkers'
import CoproNotFound from './copropriete/CoproNotFound'
import { getServerUrl } from './getAppUrl'
import useAddAddressMap from './useAddAddressMap'
import { encodeSituation } from './publicodes/situationUtils'
import useSetSearchParams from './useSetSearchParams'

const noAddressDottedName = 'copropriété . id'
export default function AddressSearch({ setChoice, situation, type }) {
  const setSearchParams = useSetSearchParams()

  const [immediateInput, setInput] = useState('')

  const [input] = useDebounce(immediateInput, 300)

  const [results, setResults] = useState(null)
  const [copros, setCopros] = useState(null)
  const [copro, setCopro] = useState(null)
  const [dpes, setDpes] = useState(null)

  const mapContainerRef = useRef(null)
  const setLocation = useCallback((location) => console.log(location), [])

  const active = results?.length > 0
  const map = useAddAddressMap(mapContainerRef, setLocation, active)

  const [clicked, setClicked] = useState(false)

  const validInput = input && input.length >= 5
  const [error, setError] = useState()

  const selectedCoproIdRaw = situation['copropriété . id'],
    selectedCoproId = selectedCoproIdRaw?.replace(/"/g, '')

  useEffect(() => {
    if (!clicked) return

    const [lat, lon] = clicked.geometry.coordinates
    async function fetchCopros() {
      try {
        const url = `${getServerUrl()}/findCopro/${lon}/${lat}/6`
        const request = await fetch(url)
        const json = await request.json()
        setCopros(json)
        setError(null)
      } catch (e) {
        console.error(e)
        setError({ message: 'Erreur pendant la récupération des copropriétés' })
      }
    }
    fetchCopros()
  }, [clicked, setCopros, setError])

  useEffect(() => {
    return //TODO disactivated for now in the copro route
    if (!clicked) return

    const [lat, lon] = clicked.geometry.coordinates
    async function fetchDPE() {
      try {
        const url = `${getServerUrl()}/findDPE/${lon}/${lat}`
        const request = await fetch(url)
        const json = await request.json()
        console.log('cyan', json)
        setDpes(json)
        setError(null)
      } catch (e) {
        console.error(e)
        setError({ message: 'Erreur pendant la récupération des DPEs' })
      }
    }
    fetchDPE()
  }, [clicked, setDpes, setError])

  useEffect(() => {
    if (!validInput) return

    const asyncFetch = async () => {
      const request = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${input}&limit=3`,
      )
      const { features } = await request.json()

      setResults(features)
    }

    asyncFetch()
  }, [input, validInput])

  return (
    <AddressInput>
      {error && <p className="fr-text--error">{error.message} </p>}
      <input
        css={`
          ${clicked &&
          input &&
          `border-bottom: 2px solid var(--validColor) !important;`};
        `}
        type="text"
        autoFocus={true}
        value={immediateInput}
        placeholder={'12 rue Victor Hugo Rennes'}
        onChange={(e) => {
          setClicked(false)
          setInput(e.target.value)
        }}
      />
      {clicked && input && <Validated>Adresse validée</Validated>}
      {validInput && !results && (
        <small
          css={`
            margin: 0.2rem 0;
            display: flex;
            align-items: center;
          `}
        >
          <Loader />
          Chargement...
        </small>
      )}
      {active && !clicked && (
        <small
          css={`
            color: #929292;
            margin: 0.2rem 0 0.2rem 0.1rem;
            font-size: 90%;
          `}
        >
          Sélectionnez une adresse :
        </small>
      )}
      <ResultsList>
        {active &&
          !clicked &&
          results.map((result) => {
            const { label, id } = result.properties
            return (
              <li
                className={
                  situation &&
                  situation[type] &&
                  situation[type].replace(/"/g, '') == id
                    ? 'selected'
                    : ''
                }
                key={id}
                onClick={() => {
                  setInput(label)
                  setClicked(result)
                }}
              >
                <span>{label}</span>
              </li>
            )
          })}
      </ResultsList>
      {copros?.length && selectedCoproId == null && (
        <small
          css={`
            margin: 0.2rem 0 0.2rem 0.1rem;
            font-size: 90%;
            color: #929292;
          `}
        >
          Sélectionnez une copropriété :
        </small>
      )}
      {copros?.length > 0 && !copro && (
        <ResultsList>
          {copros.map((copro) => {
            const {
              'Nom d’usage de la copropriété': name,
              "Numéro d'immatriculation": id,
              distance,
            } = copro

            return (
              <li
                className={selectedCoproId === id ? 'selected' : ''}
                key={id}
                onClick={() => {
                  setChoice(copro)
                  setCopro(copro)
                }}
              >
                <span>{name}</span>
                <small>
                  à{' '}
                  {Math.round(
                    distance * 10000, // why this factor ? Dunno, I've estimated it
                  ) * 10}{' '}
                  m
                </small>
              </li>
            )
          })}
        </ResultsList>
      )}
      {copro && <CoproBlock copro={copro} setCopro={setCopro} />}
      {map && active && (
        <MapMarkers map={map} data={results} selectMarker={setClicked} />
      )}
      {copros && (
        <MapMarkers
          icon="copro.png"
          map={map}
          selected={copro}
          data={copros.map((copro) => {
            const { long: lon, lat } = copro
            return { ...copro, geometry: { coordinates: [+lon, +lat] } }
          })}
          selectMarker={(arg) => {
            setChoice(arg)
            setCopro(arg)
          }}
        />
      )}
      {dpes && (
        <DPEMarkers
          map={map}
          featureCollection={{
            type: 'FeatureCollection',

            features: dpes.map((dpe) => {
              const { lon, lat, 'N°_étage_appartement': etage } = dpe
              return {
                type: 'Feature',
                geometry: {
                  coordinates: [+lon, +lat],
                  type: 'Point',
                },
                properties: { ...dpe, etage: +etage, height: 3 },
              }
            }),
          }}
          selectMarker={() => null}
        />
      )}
      {active && (
        <div
          ref={mapContainerRef}
          css={`
            width: 100%;
            min-height: 400px;
            height: 100%;
            border-radius: 0.3rem;
          `}
        />
      )}
      {copros != null && <CoproNotFound />}
      <Link
        css={`
          display: flex !important;
          align-items: center !important;
        `}
        href={setSearchParams(
          encodeSituation(
            {
              [noAddressDottedName]: '"evitee"',
            },
            false,
            [noAddressDottedName],
          ),
          'url',
        )}
      >
        Continuer sans saisir l'adresse
      </Link>
    </AddressInput>
  )
}

export const AddressInput = styled.div`
  display: flex;
  flex-direction: column;
  input {
    margin: 0;
    padding-left: 1.5rem !important;
    text-align: left !important;
    outline: none;
    box-shadow: none !important;
    height: 2.8rem !important;
    border-bottom: 2px solid #3a3a3a;
  }
`

const Validated = styled.p`
  margin: 0.5rem 0;
  color: var(--validColor);
  &::before {
    background-color: currentColor;
    content: '';
    display: inline-block;
    height: 1rem;
    margin-right: 0.25rem;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    vertical-align: -0.125rem;
    width: 1rem;
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTEyIDIyQzYuNDc3IDIyIDIgMTcuNTIzIDIgMTJTNi40NzcgMiAxMiAyczEwIDQuNDc3IDEwIDEwLTQuNDc3IDEwLTEwIDEwem0tLjk5Ny02IDcuMDctNy4wNzEtMS40MTQtMS40MTQtNS42NTYgNS42NTctMi44MjktMi44MjktMS40MTQgMS40MTRMMTEuMDAzIDE2eiIvPjwvc3ZnPg==);
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTEyIDIyQzYuNDc3IDIyIDIgMTcuNTIzIDIgMTJTNi40NzcgMiAxMiAyczEwIDQuNDc3IDEwIDEwLTQuNDc3IDEwLTEwIDEwem0tLjk5Ny02IDcuMDctNy4wNzEtMS40MTQtMS40MTQtNS42NTYgNS42NTctMi44MjktMi44MjktMS40MTQgMS40MTRMMTEuMDAzIDE2eiIvPjwvc3ZnPg==);
  }
`

export const ResultsList = styled.ol`
  padding: 0;
  background: #f5f5fe;
  border-radius: 0 0 5px 5px;
  border: 1px solid #dfdff0;
  z-index: 999999;
  margin-bottom: 0.6rem;
  li {
    width: fit-content;
    margin: 0.2rem 0 0.2rem 1.6rem;
    line-height: 1.2rem;
    span {
      padding: 0.1rem 0.2rem;
    }
    span:hover {
      background: var(--color);
      color: white;
      border-radius: 0.2rem;
    }
    &.selected {
      background: rgba(0, 0, 145, 0.1);
      color: var(--color);
      list-style: none;
    }
    &.selected::before {
      content: '✔';
      margin-left: -20px;
      margin-right: 7px;
    }
    cursor: pointer;
  }
`

export const getCoproId = (selected) =>
  selected && selected["Numéro d'immatriculation"]
