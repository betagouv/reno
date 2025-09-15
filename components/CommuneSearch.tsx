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
  const [immediateInput, setImmediateInput] = useState(
    !empty ? situation?.[type]?.replaceAll('"', '') || '' : '',
  )

  const [input] = useDebounce(immediateInput, 300)
  const [error, setError] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [clicked, setClicked] = useState(Boolean(!empty && situation?.[type]))

  const validInput = input && input.length >= 3

  useEffect(() => {
    async function fetchCommune() {
      if (empty) return
      const commune = await getCommune(situation, type)
      if (commune) {
        setImmediateInput(`${commune.nom} ${commune.codeDepartement}`)
      }
    }
    fetchCommune()
  }, [situation, type])

  useEffect(() => {
    setError('')
    if (!validInput) return
    if (onlyNumbers(input) && input.length !== 5) return
    const asyncFetch = async () => {
      setIsLoading(true)
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
        setError("Aucune adresse n'a été trouvée")
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

      setIsLoading(false)
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
            setImmediateInput(e.target.value)
          },
          required: true,
          autoFocus,
          placeholder: 'Commune ou code postal',
        }}
        state={error != '' ? 'error' : clicked && input ? 'success' : undefined}
        stateRelatedMessage={
          clicked && input ? 'Adresse validée' : error ? error : undefined
        }
      />
      {validInput && isLoading && !clicked && !error && (
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
                      setImmediateInput(
                        `${result.nom} ${result.codeDepartement}`,
                      )
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
