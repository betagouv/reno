import { Loader } from '@/app/trouver-accompagnateur-renov/UI'
import { useEffect, useState } from 'react'
import css from './css/convertToJs'
import { useDebounce } from 'use-debounce'

function onlyNumbers(str) {
  return /^\d+/.test(str)
}

export default function AddressSearch({ setChoice, situation }) {
  const [immediateInput, setInput] = useState('')

  const [input] = useDebounce(immediateInput, 300)

  const [results, setResults] = useState(null)
  const [clicked, setClicked] = useState(null)
  const validInput = input && input.length >= 3

  useEffect(() => {
    if(situation["ménage . commune"]) {
      fetch(`https://geo.api.gouv.fr/communes?code=${situation["ménage . commune"].replace(/"/g, '')}`)
        .then((response) => response.json())
        .then((json) => setInput(json[0].nom + " "+ json[0].codeDepartement));
    }
  }, [])
  
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
        type="text"
        autoFocus={true}
        value={immediateInput}
        placeholder={'commune ou code postal'}
        onChange={(e) => setInput(e.target.value)}
      />
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
      {results && (
        <ul
          style={css`
            margin-top: 0.6rem;
            width: 20rem;
            max-width: 90vw;
            list-style-type: none;
          `}
        >
          {results.map((result) => (
            <li
              key={result.code}
              onClick={() => {
                setClicked(result)
                setChoice(result)
                setInput(result.nom + " " + result.codeDepartement)
              }}
              css={`
                cursor: pointer;
                text-align: right;
                ${clicked &&
                clicked.code === result.code &&
                `background: var(--lighterColor)`}
              `}
            >
              {result.nom} <small>{result.codeDepartement}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
