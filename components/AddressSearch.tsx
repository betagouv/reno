import { useEffect, useState } from 'react'
import css from './css/convertToJs'

function startsWithNumber(str) {
  return /^\d/.test(str)
}

export default function AddressSearch({ setChoice }) {
  const [input, setInput] = useState(null)
  const [results, setResults] = useState(null)
  const [clicked, setClicked] = useState(null)

  useEffect(() => {
    if (!input || input.length < 3) return

    console.log('input', input)
    const asyncFetch = async () => {
      const request = await fetch(
        startsWithNumber(input)
          ? `https://geo.api.gouv.fr/communes?codePostal=${input}&boost=population&limit=5`
          : `https://geo.api.gouv.fr/communes?nom=${input}&boost=population&limit=5`,
      )
      const json = await request.json()

      setResults(json)
    }

    asyncFetch()
  }, [input])

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
        value={input}
        placeholder={'commune ou code postal'}
        onChange={(e) => setInput(e.target.value)}
      />
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
