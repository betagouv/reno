import { Loader } from '@/app/trouver-conseiller-france-renov/UI'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { getCommune } from './personas/enrichSituation'
import Input from '@codegouvfr/react-dsfr/Input'
import { CityList } from './AddressSearch'
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons'

function onlyNumbers(str) {
  return /^\d+/.test(str)
}

export default function CommuneSearch({
  label,
  setChoice,
  situation,
  type,
  autoFocus = true,
}) {
  const [immediateInput, setInput] = useState(
    situation[type]?.replaceAll('"', '') || '',
  )

  const [input] = useDebounce(immediateInput, 300)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [clicked, setClicked] = useState(situation && situation[type])

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
    <div className="fr-fieldset__element fr-p-0">
      <Input
        label={label}
        nativeInputProps={{
          value: immediateInput,
          onChange: (e) => {
            setClicked(false)
            setInput(e.target.value)
          },
          required: true,
          autoFocus: autoFocus,
          placeholder: 'commune ou code postal',
        }}
        state={clicked && input && 'success'}
        stateRelatedMessage={
          clicked && input ? (
            'Adresse validée'
          ) : validInput && !results ? (
            <div className="fr-mt-3v">
              <Loader /> Chargement ...
            </div>
          ) : input == '' ? (
            <></>
          ) : (
            <div className="fr-mt-3v">
              <RadioButtons
                legend="Sélectionnez une ville :"
                options={results?.map((result) => {
                  return {
                    label: (
                      <span>
                        {result.nom}&nbsp;
                        <small>{result?.codesPostaux[0]}</small>
                      </span>
                    ),
                    nativeInputProps: {
                      value: result.nom + ' ' + result.codeDepartement,
                      checked:
                        situation &&
                        situation[type] &&
                        situation[type].replace(/"/g, '') == result.code,
                      onChange: () => {
                        setChoice(result)
                        setInput(result.nom + ' ' + result.codeDepartement)
                        setClicked(true)
                      },
                    },
                  }
                })}
              />
            </div>
          )
        }
      />
    </div>
  )
}
