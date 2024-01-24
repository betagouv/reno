import { useEffect, useState } from 'react'
import css from './css/convertToJs'
import { encodeSituation } from './publicodes/situationUtils'

export default function AddressSearch({
  setSearchParams,
  situation,
  answeredQuestions,
}) {
  const [input, setInput] = useState(null)
  const [results, setResults] = useState(null)

  useEffect(() => {
    if (!input || input.length < 3) return

    console.log('input', input)
    const asyncFetch = async () => {
      const request = await fetch(
        ` https://api.gorenove.fr/v2/gorenove/addresses/search?q=${input}`,
      )
      const json = await request.json()

      setResults(json.features)
    }

    asyncFetch()
  }, [input])

  console.log(results)

  const setChoice = (result) => {
    const encodedSituation = encodeSituation(
      {
        ...situation,
        région: `"${result.properties.context.split(', ')[2]}"`,
        'id ban': `"${result.properties.id}"`,
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
        placeholder={'12 rue Victor Hugo Rennes'}
        onChange={(e) => setInput(e.target.value)}
      />
      {results && (
        <ul
          style={css`
            width: 25rem;
            max-width: 90vw;
            list-style-type: none;
          `}
        >
          {results.map((result) => (
            <li
              key={result.properties.x + result.properties.y}
              onClick={() => setChoice(result)}
              style={css`
                cursor: pointer;
                text-align: right;
              `}
            >
              {result.properties.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
