'use client'
import { Loader } from '@/app/trouver-conseiller-france-renov/UI'
import Input from '@codegouvfr/react-dsfr/Input'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import OutreMerInformation from './OutreMerInformation'

export default function AddressSearch({
  setCoordinates,
  coordinates,
  dpe,
  situation,
  engine = null,
  addressResults,
  setAddressResults,
  onChange = null,
  label = '',
}) {
  const [immediateInput, setInput] = useState(
    dpe?.['adresse_ban'] ||
      situation['logement . adresse']?.replaceAll('"', '') ||
      '',
  )
  const [input] = useDebounce(immediateInput, 300)
  const [clicked, setClicked] = useState(situation['logement . adresse'] || '')

  const validInput = input && input.length >= 5
  const [error, setError] = useState('')

  const validCoordinates = coordinates && coordinates.every(Boolean)

  useEffect(() => {
    setError('')
    if (!validInput) return
    const asyncFetch = async () => {
      const request = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${input}&limit=5`,
      )
      const { features } = await request.json()
      if (features.length == 0) {
        setError("Aucune adresse n'a été trouvée")
      }
      setAddressResults(features)
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
            setCoordinates([undefined, undefined])
            setClicked(false)
            setInput(e.target.value)
          },
          type: 'text',
          name: 'adresse',
          required: true,
          autoFocus: true,
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

      {validInput && !addressResults && !clicked && !error && (
        <div className="fr-mt-3v">
          <Loader /> Chargement ...
        </div>
      )}

      {addressResults && addressResults.length > 0 && !clicked && (
        <div>
          <p className="fr-my-3v">Sélectionnez une adresse :</p>
          <ul>
            {addressResults.map((result, i) => {
              const { label, id, context, postcode } = result.properties

              const ambiguity = addressResults.find(
                (result, index) =>
                  i !== index && result.properties.label === label,
              )

              return (
                <li key={id}>
                  <button
                    onClick={async (e) => {
                      e.preventDefault()
                      setAddressResults(null)
                      if (onChange) {
                        await onChange(result)
                      }
                      setInput(label)
                      setCoordinates(result.geometry.coordinates)
                      setClicked(result)
                    }}
                  >
                    {label} {postcode}
                    {ambiguity && <small>{context}</small>}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
      <OutreMerInformation {...{ situation, engine }} />
    </>
  )
}
