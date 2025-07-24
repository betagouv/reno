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
        <div
          className={`fr-input-group ${error && 'fr-input-group--error'} ${clicked && input && 'fr-input-group--valid'}`}
        >
          <Input
            nativeInputProps={{
              value: immediateInput,
              onChange: (e) => {
                setCoordinates([undefined, undefined])
                setClicked(false)
                setInput(e.target.value)
              },
              type: 'text',
              name: 'sujet',
              required: true,
              autoFocus: true,
            }}
          />
          {clicked && input && (
            <div
              className="fr-messages-group"
              id="input-0-messages"
              aria-live="polite"
            >
              <p
                className="fr-message fr-message--valid"
                id="input-0-message-valid"
              >
                Adresse validée
              </p>
            </div>
          )}
          {error && (
            <div
              className="fr-messages-group"
              id="input-0-messages"
              aria-live="polite"
            >
              <p className="fr-message input-0-message-error">
                {error.message}{' '}
              </p>
            </div>
          )}
        </div>
      </div>
      {validInput && !addressResults && (
        <small
          css={`
            margin: 0.2rem 0;
            display: flex;
            align-items: center;
          `}
        >
          <Loader />
          Chargement...
        </small>
      )}
      {addressResults && !clicked && (
        <div
          css={`
            display: flex;
            align-items: top;
            gap: 1em;
          `}
        >
          <small
            css={`
              color: #929292;
              margin: 0.2rem 0 0.2rem 0.1rem;
              font-size: 90%;
            `}
          >
            Sélectionnez une adresse :
          </small>
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
                    setInput(label)
                    //setCoordinates(result.geometry.coordinates)
                    setClicked(result)
                    onChange && onChange(result)
                  }}
                >
                  <span>{label}</span>
                </li>
              )
            })}
          </CityList>
        </div>
      )}
    </>
  )
}

export const AddressInput = styled.div`
  display: flex;
  flex-direction: column;
  input {
    margin: 0;
    padding-left: 1.5rem !important;
    text-align: left !important;
    outline: none;
    box-shadow: none !important;
    height: 2.8rem !important;
    border-bottom: 2px solid #3a3a3a;
  }
`

const Validated = styled.p`
  margin: 0.5rem 0;
  color: var(--validColor);
  &::before {
    background-color: currentColor;
    content: '';
    display: inline-block;
    height: 1rem;
    margin-right: 0.25rem;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    vertical-align: -0.125rem;
    width: 1rem;
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTEyIDIyQzYuNDc3IDIyIDIgMTcuNTIzIDIgMTJTNi40NzcgMiAxMiAyczEwIDQuNDc3IDEwIDEwLTQuNDc3IDEwLTEwIDEwem0tLjk5Ny02IDcuMDctNy4wNzEtMS40MTQtMS40MTQtNS42NTYgNS42NTctMi44MjktMi44MjktMS40MTQgMS40MTRMMTEuMDAzIDE2eiIvPjwvc3ZnPg==);
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTEyIDIyQzYuNDc3IDIyIDIgMTcuNTIzIDIgMTJTNi40NzcgMiAxMiAyczEwIDQuNDc3IDEwIDEwLTQuNDc3IDEwLTEwIDEwem0tLjk5Ny02IDcuMDctNy4wNzEtMS40MTQtMS40MTQtNS42NTYgNS42NTctMi44MjktMi44MjktMS40MTQgMS40MTRMMTEuMDAzIDE2eiIvPjwvc3ZnPg==);
  }
`

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
