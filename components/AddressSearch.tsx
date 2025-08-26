'use client'
import { Loader } from '@/app/trouver-conseiller-france-renov/UI'
import Input from '@codegouvfr/react-dsfr/Input'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons'
import { useDebounce } from 'use-debounce'

export default function AddressSearch({
  setCoordinates,
  coordinates,
  dpe,
  situation,
  addressResults,
  setAddressResults,
  onChange = null,
  label = '',
}) {
  const [immediateInput, setInput] = useState(
    dpe?.['adresse_ban'] ||
      situation['logement . adresse']?.replaceAll('"', ''),
  )
  const [input] = useDebounce(immediateInput, 300)
  const [clicked, setClicked] = useState(situation['logement . adresse'] || '')

  const validInput = input && input.length >= 5
  const [error, setError] = useState()

  const validCoordinates = coordinates && coordinates.every(Boolean)

  useEffect(() => {
    if (!validInput) return

    const asyncFetch = async () => {
      const request = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${input}&limit=5`,
      )
      const { features } = await request.json()

      setAddressResults(features)
    }

    asyncFetch()
  }, [input, validInput])

  return (
    <Input
      label={label}
      nativeInputProps={{
        value: immediateInput,
        onChange: (e) => {
          setCoordinates([undefined, undefined])
          setClicked(false)
          setInput(e.target.value)
        },
        type: 'text',
        name: 'adresse',
        required: true,
        autoFocus: true,
      }}
      state={error ? 'error' : clicked && input ? 'success' : ''}
      stateRelatedMessage={
        clicked && input ? (
          'Adresse validée'
        ) : error ? (
          error
        ) : validInput && !addressResults ? (
          <div className="fr-mt-3v">
            <Loader /> Chargement ...
          </div>
        ) : input == '' ? (
          <></>
        ) : (
          addressResults &&
          !clicked && (
            <div className="fr-mt-3v">
              <RadioButtons
                legend="Sélectionnez une adresse"
                options={addressResults.map((result) => {
                  const { label, id } = result.properties
                  return {
                    label: label,
                    nativeInputProps: {
                      value: id,
                      checked: situation['logement . adresse'] === id,
                      onChange: () => {
                        setAddressResults(null)
                        onChange &&
                          onChange(result).then(() => {
                            setInput(label)
                            //setCoordinates(result.geometry.coordinates)
                            setClicked(result)
                          })
                      },
                    },
                  }
                })}
              />
            </div>
          )
        )
      }
    />
  )
}
