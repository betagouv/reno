'use client'
import { Loader } from '@/app/trouver-conseiller-france-renov/UI'
import Input from '@codegouvfr/react-dsfr/Input'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
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
    <>
      <div className="fr-fieldset__element">
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
              <>
                <Loader /> Chargement ...
              </>
            ) : input == '' ? (
              <></>
            ) : (
              addressResults &&
              !clicked && (
                <>
                  <span>Sélectionnez une adresse :</span>
                  <CityList>
                    {addressResults.map((result) => {
                      const { label, id } = result.properties
                      return (
                        <li
                          className={
                            coordinates &&
                            coordinates.join('|') ===
                              result.geometry.coordinates.join('|')
                              ? 'selected'
                              : ''
                          }
                          key={id}
                          onClick={() => {
                            onChange &&
                              onChange(result).then(() => {
                                setInput(label)
                                //setCoordinates(result.geometry.coordinates)
                                setClicked(result)
                              })
                          }}
                        >
                          <span>{label}</span>
                        </li>
                      )
                    })}
                  </CityList>
                </>
              )
            )
          }
        />
      </div>
    </>
  )
}

export const CityList = styled.ul`
  padding: 0;
  background: #f5f5fe;
  border-radius: 0 0 5px 5px;
  border: 1px solid #dfdff0;
  z-index: 999999;
  margin-bottom: 0.6rem;
  li {
    width: fit-content;
    margin: 0.2rem 0 0.2rem 1.6rem;
    line-height: 1.2rem;
    span {
      padding: 0.1rem 0.2rem;
    }
    span:hover {
      background: var(--color);
      color: white;
      border-radius: 0.2rem;
    }
    &.selected {
      background: rgba(0, 0, 145, 0.1);
      color: var(--color);
      list-style: none;
    }
    &.selected::before {
      content: '✔';
      margin-left: -20px;
      margin-right: 7px;
    }
    cursor: pointer;
  }
`
