import { Loader } from '@/app/trouver-accompagnateur-renov/UI'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import styled from 'styled-components'
import { getCommune } from './personas/enrichSituation'
function onlyNumbers(str) {
  return /^\d+/.test(str)
}

export default function AddressSearch({ setChoice, situation, type }) {
  const [immediateInput, setInput] = useState('')

  const [input] = useDebounce(immediateInput, 300)

  const [results, setResults] = useState(null)
  const [clicked, setClicked] = useState(false)
  const validInput = input && input.length >= 3

  // Get the commune name from the code if it exists to display it in the search box
  useEffect(() => {
    async function fetchCommune() {
      const commune = await getCommune(situation, type)
      if (commune) {
        setInput(commune.nom + ' ' + commune.codeDepartement)
      }
    }
    fetchCommune()
  }, [situation, setInput])

  useEffect(() => {
    if (!validInput) return
    // Le code postal en France est une suite de cinq chiffres https://fr.wikipedia.org/wiki/Code_postal_en_France
    if (onlyNumbers(input) && input.length !== 5) return

    const asyncFetch = async () => {
      const request = await fetch(
        onlyNumbers(input)
          ? `https://geo.api.gouv.fr/communes?codePostal=${input}`
          : `https://geo.api.gouv.fr/communes?nom=${input}&boost=population&limit=5`,
      )
      const json = await request.json()

      const enrichedResults = await Promise.all(
        json.map((commune) =>
          fetch(`/api/communes?insee=${commune.code}&nom=${commune.nom}`)
            .then((response) => response.json())
            .then((json) => ({ ...commune, eligibilite: json })),
        ),
      )
      setResults(enrichedResults)
    }

    asyncFetch()
  }, [input, validInput])

  return (
    <AddressInput>
      <input
        css={`
          ${clicked &&
          input &&
          `border-bottom: 2px solid var(--validColor) !important;`};
        `}
        type="text"
        autoFocus={true}
        value={immediateInput}
        placeholder={'commune ou code postal'}
        onChange={(e) => {
          setClicked(false)
          setInput(e.target.value)
        }}
      />
      {clicked && input && <p>Commune valide</p>}
      <CityList>
        {validInput && !results && (
          <li
            css={`
              margin: 0.8rem 0;
              display: flex;
              align-items: center;
            `}
          >
            <Loader />
            Chargement...
          </li>
        )}
        {results && !clicked && (
          <>
            <li
              css={`
                color: #929292;
              `}
            >
              Sélectionnez une ville
            </li>
            {results.map((result) => (
              <li
                className={
                  situation &&
                  situation[type] &&
                  situation[type].replace(/"/g, '') == result.code
                    ? 'selected'
                    : ''
                }
                key={result.code}
                onClick={() => {
                  setChoice(result)
                  setInput(result.nom + ' ' + result.codeDepartement)
                  setClicked(true)
                }}
              >
                {result.nom} <small>{result?.codesPostaux[0]}</small>
              </li>
            ))}
          </>
        )}
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
  p {
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
  }
`

export const CityList = styled.ul`
  padding: 0;
  background: #f5f5fe;
  border-radius: 0 0 5px 5px;
  border: 1px solid #dfdff0;
  list-style-type: none;
  position: absolute;
  margin-top: 35px;
  li {
    padding: 8px 24px 8px 35px;
    line-height: 1.2rem;
    &::before,
    &.selected::before {
      content: '';
    }
    &:not(:first-child):hover,
    &.selected {
      background: rgba(0, 0, 145, 0.1);
      color: var(--color);
    }
    &:not(:first-child):hover::before,
    &.selected::before {
      content: '✔';
      margin-left: -20px;
      margin-right: 7px;
    }
    &:not(:first-child) {
      cursor: pointer;
    }
  }
`
