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
  const [clicked, setClicked] = useState(null)

  useEffect(() => {
    if (!input || input.length < 3) return

    console.log('input', input)
    const asyncFetch = async () => {
      const request = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${input}&type=municipality`,
      )
      const json = await request.json()

      setResults(json.features)
    }

    asyncFetch()
  }, [input])

  console.log(results)

  const setChoice = (result) => {
    setClicked(result)
    const region = result.properties.context.split(', ')[2]
    const codePostal = result.properties.postcode
    console.log('user clicked adress result ', result, region)
    const encodedSituation = encodeSituation(
      {
        ...situation,
        'ménage . commune': `"${codePostal}"`,
        'ménage . région': `"${region}"`,
        'ménage . id ban': `"${result.properties.id}"`,
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
        placeholder={'Commune ou code postal'}
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
              key={result.properties.postcode}
              onClick={() => setChoice(result)}
              css={`
                cursor: pointer;
                text-align: right;
                ${clicked &&
                clicked.properties.id === result.properties.id &&
                `background: var(--lighterColor)`}
              `}
            >
              {result.properties.label}{' '}
              <small>{result.properties.postcode}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
