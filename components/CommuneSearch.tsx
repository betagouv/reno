import { Loader } from '@/app/trouver-conseiller-france-renov/UI'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { getCommune } from './personas/enrichSituation'
import Input from '@codegouvfr/react-dsfr/Input'

function onlyNumbers(str) {
  return /^\d+$/.test(str)
}

export default function CommuneSearch({
  label,
  setChoice,
  situation,
  type,
  empty = false,
  autoFocus = true,
}) {
  const [immediateInput, setInput] = useState(
    !empty
      ? situation?.[type + ' . nom']
        ? (
            situation?.[type + ' . nom'] +
            ' ' +
            situation?.[type.split('.')[0] + '. code département']
          ).replaceAll('"', '')
        : ''
      : '',
  )

  const [input] = useDebounce(immediateInput, 300)
  const [clicked, setClicked] = useState(Boolean(!empty && situation?.[type]))

  const validInput = input && input.length >= 3
  const [error, setError] = useState('')

  const [results, setResults] = useState(null)

  useEffect(() => {
    setError('')
    if (!validInput) return
    if (onlyNumbers(input) && input.length !== 5) return
    const asyncFetch = async () => {
      setResults(null)

      const request = await fetch(
        onlyNumbers(input)
          ? `/api/geo/?path=${encodeURIComponent(
              `communes?codePostal=${input}`,
            )}`
          : `/api/geo/?path=${encodeURIComponent(
              `communes?nom=${input}&boost=population&limit=5`,
            )}`,
      )
      const json = await request.json()

      if (json.length == 0) {
        setError("Aucune commune n'a été trouvée")
      } else {
        const enrichedResults = await Promise.all(
          json.map((commune) =>
            fetch(`/api/communes?insee=${commune.code}&nom=${commune.nom}`)
              .then((response) => response.json())
              .then((eligibilite) => ({ ...commune, eligibilite })),
          ),
        )
        setResults(enrichedResults)
      }
    }

    asyncFetch()
  }, [input, validInput])
  return (
    <>
      <Input
        label={label}
        nativeInputProps={{
          value: immediateInput,
          onChange: (e) => {
            setClicked(false)
            setInput(e.target.value)
          },
          required: true,
          autoFocus,
          placeholder: 'Commune ou code postal',
        }}
        state={error != '' ? 'error' : clicked && input ? 'success' : undefined}
        stateRelatedMessage={
          clicked && input && error == ''
            ? 'Adresse validée'
            : error
              ? error
              : undefined
        }
      />
      {validInput && !results && !clicked && !error && (
        <div className="fr-mt-3v">
          <Loader /> Chargement ...
        </div>
      )}
      {results && results.length > 0 && !clicked && (
        <div>
          <p className="fr-my-3v">Sélectionnez une ville :</p>
          <ul>
            {results.map((result, i) => {
              return (
                <li key={i}>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      setChoice(result)
                      setInput(`${result.nom} ${result.codeDepartement}`)
                      setClicked(true)
                    }}
                  >
                    {result.nom}&nbsp;<small>{result.codesPostaux[0]}</small>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </>
  )
}
