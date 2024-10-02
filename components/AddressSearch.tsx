import { Loader } from '@/app/trouver-accompagnateur-renov/UI'
import { useEffect, useState } from 'react'
import css from './css/convertToJs'
import { useDebounce } from 'use-debounce'
import styled from 'styled-components'
import checkIcon from '@/public/check-green.svg'
import Image from 'next/image'
function onlyNumbers(str) {
  return /^\d+/.test(str)
}

export default function AddressSearch({ setChoice, situation }) {
  const [immediateInput, setInput] = useState('')

  const [input] = useDebounce(immediateInput, 300)

  const [results, setResults] = useState(null)
  const [clicked, setClicked] = useState(false)
  const validInput = input && input.length >= 3

  useEffect(() => {
    if (situation && situation['ménage . commune']) {
      fetch(
        `https://geo.api.gouv.fr/communes?code=${situation['ménage . commune'].replace(/"/g, '')}`,
      )
        .then((response) => response.json())
        .then((json) => {
          setInput(json[0].nom + ' ' + json[0].codeDepartement)
          setClicked(true)
        })
    }
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
    <div
      style={css`
        display: flex;
        flex-direction: column;
        align-items: end;
      `}
    >
      <input
        css={`
          margin: 0;
          padding-right: 1.5rem !important;
          ${clicked && input && `border-bottom: 2px solid var(--validColor) !important;`}
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
      { clicked && input && 
        <Image
            src={checkIcon}
            alt="Icône d'un check"
            css={`
              position: relative;
              transform: translateY(-170%);
              width: 20px;
              height: 20px;
            `}
          />
      }
      {validInput && !results && (
        <div
          css={`
            margin: 0.8rem 0;
            display: flex;
            align-items: center;
          `}
        >
          <Loader />
          Chargement...
        </div>
      )}
      {results && !clicked && (
        <CityList>
          <li css={`color: #929292;`}>Sélectionnez une ville</li>
          {results.map((result) => (
            <li
              className={situation['ménage . commune'] && situation['ménage . commune'].replace(/"/g, '') == result.code ? "selected" : ""}
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
        </CityList>
      )}
    </div>
  )
}

export const CityList = styled.ul`
  padding: 0;
  background: #F5F5FE;
  border-radius: 0 0 5px 5px;
  border: 1px solid #DFDFF0;
  list-style-type: none;
  li {
    padding: 8px 24px 8px 35px;
    line-height: 1.2rem;
    &::before, &.selected::before {
      content: '';
    }
    &:not(:first-child):hover, &.selected {
      background: rgba(0, 0, 145, 0.10);
      color: var(--color);
    }
    &:not(:first-child):hover::before, &.selected::before {
      content: '✔';
      margin-left: -20px;
      margin-right: 7px;
    }
    &:not(:first-child) {
      cursor: pointer;
    }
  }
`
