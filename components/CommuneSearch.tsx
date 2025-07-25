import { Loader } from '@/app/trouver-conseiller-france-renov/UI'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import styled from 'styled-components'
import { getCommune } from './personas/enrichSituation'
import Input from '@codegouvfr/react-dsfr/Input'
import { CityList } from './AddressSearch'

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
  const [immediateInput, setInput] = useState('')

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
    <div className="fr-fieldset__element">
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
            <>
              <Loader /> Chargement ...
            </>
          ) : input == '' ? (
            <></>
          ) : (
            <>
              <div>
                <small>Sélectionnez une ville :</small>
                <CityList>
                  {results?.map((result) => (
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
                </CityList>
              </div>
            </>
          )
        }
      />
    </div>
  )
}
