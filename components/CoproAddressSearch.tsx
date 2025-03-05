import { Loader } from '@/app/trouver-accompagnateur-renov/UI'
import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useDebounce } from 'use-debounce'
import MapMarkers from './AddressSearchMapMarkers'
import { getCommune } from './personas/enrichSituation'
import useAddAddressMap from './useAddAddressMap'
import { getServerUrl } from './getAppUrl'
function onlyNumbers(str) {
  return /^\d+/.test(str)
}

export default function AddressSearch({ setChoice, situation, type }) {
  const [immediateInput, setInput] = useState('')

  const [input] = useDebounce(immediateInput, 300)

  const [results, setResults] = useState(null)
  const [copros, setCopros] = useState(null)
  const mapContainerRef = useRef(null)
  const setLocation = useCallback((location) => console.log(location), [])

  const active = results?.length > 0
  const map = useAddAddressMap(mapContainerRef, setLocation, active)

  const [clicked, setClicked] = useState(false)
  const validInput = input && input.length >= 5
  const [error, setError] = useState()

  // Get the commune name from the code if it exists to display it in the search box
  useEffect(() => {
    if (!clicked) return

    const [lat, lon] = clicked.geometry.coordinates
    async function fetchCopros() {
      try {
        const url = `${getServerUrl()}/findCopro/${lon}/${lat}`
        const request = await fetch(url)
        const json = await request.json()
        console.log('cyan', json)
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
      {error && (
        <p
          css={`
            background: #f9e2e2;
            padding: 0.1rem 0.6rem;
          `}
        >
          {error.message}{' '}
        </p>
      )}
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
      {results && !clicked && (
        <small
          css={`
            margin: 0.2rem 0 0.2rem 0.6rem;
            color: #929292;
          `}
        >
          Sélectionnez une adresse :
        </small>
      )}
      <CityList>
        {results &&
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
      </CityList>
      {copros?.length > 0 && (
        <CityList>
          {copros.map((copro) => {
            const {
              'Nom d’usage de la copropriété': name,
              "Numéro d'immatriculation": id,
            } = copro

            console.log('cyan2', copro)

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
                  setChoice(copro)
                }}
              >
                <span>{name}</span>
              </li>
            )
          })}
        </CityList>
      )}
      {map && active && (
        <MapMarkers map={map} data={results} selectMarker={setClicked} />
      )}
      {copros && (
        <MapMarkers
          icon="copro.png"
          map={map}
          data={copros.map((copro) => {
            const { long: lon, lat } = copro
            return { ...copro, geometry: { coordinates: [+lon, +lat] } }
          })}
          selectMarker={setChoice}
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

export const CityList = styled.ol`
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
    }
    &.selected::before {
      content: '✔';
      margin-left: -20px;
      margin-right: 7px;
    }
    cursor: pointer;
  }
`
