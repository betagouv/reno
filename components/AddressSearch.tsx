import { useEffect, useState } from 'react'
import css from './css/convertToJs'
import { encodeSituation } from './publicodes/situationUtils'

function startsWithNumber(str) {
  return /^\d/.test(str)
}

export default function AddressSearch({
  setSearchParams,
  situation,
  answeredQuestions,
}) {
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

  console.log(results)

  const setChoice = (result) => {
    setClicked(result)
    const codeRegion = result.codeRegion
    const encodedSituation = encodeSituation(
      {
        ...situation,
        'ménage . code région': `"${codeRegion}"`,
        'ménage . commune': `"${result.code}"`,
      },
      false,
      answeredQuestions,
    )
    console.log('on change will set encodedSituation', encodedSituation)

    setSearchParams(encodedSituation, 'push', false)
  }

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
              onClick={() => setChoice(result)}
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
