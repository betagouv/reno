import { Loader } from '@/app/trouver-accompagnateur-renov/UI'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import styled from 'styled-components'
import { getCommune } from './personas/enrichSituation'

function onlyNumbers(str) {
  return /^\d+/.test(str)
}

export default function AddressSearch({
  setChoice,
  situation,
  type,
  autoFocus = true,
}) {
  const [immediateInput, setInput] = useState('')

  const [input] = useDebounce(immediateInput, 300)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [clicked, setClicked] = useState(situation[type])

  const validInput = input && input.length >= 3
  // Get the commune name from the code if it exists to display it in the search box
  useEffect(() => {
    setInput('')
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
      setIsLoading(true)
      const request = await fetch(
        onlyNumbers(input)
          ? `/api/geo/?path=${encodeURIComponent(`communes?codePostal=${input}`)}`
          : `/api/geo/?path=${encodeURIComponent(
              `communes?nom=${input}&boost=population&limit=5`,
            )}`,
      )
      const json = await request.json()

      const enrichedResults = await Promise.all(
        json.map((commune) =>
          fetch(`/api/communes?insee=${commune.code}&nom=${commune.nom}`)
            .then((response) => response.json())
            .then((json) => ({ ...commune, eligibilite: json })),
        ),
      )
      setIsLoading(false)
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
          `border-bottom: 2px solid var(--validColor) !important;
            background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMTg3NTNjIiBkPSJNMTIgMjJjLTUuNTIgMC0xMC00LjQ4LTEwLTEwUzYuNDggMiAxMiAyczEwIDQuNDggMTAgMTAtNC40OCAxMC0xMCAxMHptLS45OS02bDcuMDctNy4wNy0xLjQxLTEuNDEtNS42NiA1LjY2LTIuODMtMi44My0xLjQxIDEuNDFMMTEuMDEgMTZ6Ii8+PC9zdmc+') rgb(245, 245, 254) no-repeat top 5px right 5px !important;
            background-size:  16px !important;
            `}
        `}
        type="text"
        autoFocus={autoFocus}
        value={immediateInput}
        placeholder={'commune ou code postal'}
        onChange={(e) => {
          setClicked(false)
          setInput(e.target.value)
        }}
      />
      <CityList>
        {isLoading && (
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
              {results.length > 0
                ? 'Sélectionnez une ville'
                : 'Aucune ville trouvée'}
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
    height: 2.8rem !important;
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
  z-index: 999999;
  li {
    display: block !important;
    margin: 0 !important;
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
