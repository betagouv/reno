'use client'
import { Loader } from '@/app/trouver-accompagnateur-renov/UI'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDebounce } from 'use-debounce'

export default function DPEAddressSearch({
  searchParams,
  onSelectDpe,
  dpe,
  click = false,
}) {
  const [immediateInput, setInput] = useState(dpe['adresse_ban'])
  const [input] = useDebounce(immediateInput, 300)
  const [results, setResults] = useState(null)
  const [clicked, setClicked] = useState(click)
  const [dpes, setDpes] = useState(null)

  const validInput = input && input.length >= 5
  const [error, setError] = useState()

  useEffect(() => {
    if (!clicked || !clicked.geometry) return
    const [lon, lat] = clicked.geometry.coordinates
    async function fetchDPE() {
      try {
        const request = await fetch(
          `https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/lines?geo_distance=${lon}%3A${lat}%3A3000&size=100`,
        )
        const json = await request.json()
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
            color: #929292;
            margin: 0.2rem 0 0.2rem 0.1rem;
            font-size: 90%;
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
                className={searchParams['id'] == id ? 'selected' : ''}
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
