'use client'

import Image from 'next/image'
import { encodeDottedName, encodeSituation } from './publicodes/situationUtils'
import FormButtons from '@/app/simulation/FormButtons'
import { categories } from './utils'
import React from 'react'

export const getTravauxEnvisages = (situation) =>
  situation['projet . définition . travaux envisagés']
    ?.split(',')
    .map((t) => t.replaceAll('"', '')) || []

export const isCategorieChecked = (categorie, situation) =>
  situation['projet . définition . catégories travaux envisagées']
    ?.replaceAll('"', '')
    .split(',')
    .includes(categorie)

export const handleCheckTravaux = (geste, situation, setSearchParams) => {
  let travauxEnvisages = getTravauxEnvisages(situation)
  let encodedGeste = encodeDottedName(geste)
  if (
    travauxEnvisages &&
    encodedGeste.split(',').filter((t) => travauxEnvisages.includes(t)).length >
      0
  ) {
    travauxEnvisages = travauxEnvisages.filter(
      (travaux) => !encodedGeste.split(',').includes(travaux),
    )
  } else {
    travauxEnvisages.push(encodedGeste)
  }

  updateTravaux(setSearchParams, travauxEnvisages)
}

export const updateTravaux = (setSearchParams, travauxEnvisages) => {
  setSearchParams(
    {
      [encodeDottedName('projet . définition . travaux envisagés')]:
        travauxEnvisages.length ? `"${travauxEnvisages.join(',')}"` : undefined,
    },
    'push',
    false,
  )
}

export async function isEligibleReseauChaleur(coordinates) {
  const [lat, lon] = coordinates.split(',')
  const response = await fetch(`/api/fcu?lat=${lat}&lon=${lon}`)
  if (!response.ok) return false

  const json = await response.json()
  return json.isEligible
}

export default function ChoixTravaux({
  situation,
  answeredQuestions,
  setSearchParams,
}) {
  const rule = 'projet . définition . travaux envisagés'
  let travauxEnvisages = getTravauxEnvisages(situation)

  // Test raccordement réseau chaleur, via FCU
  isEligibleReseauChaleur(
    situation['logement . coordonnees'].replaceAll('"', ''),
  ).then((eligibility) => {
    if (eligibility) {
      categories.find((cat) => cat.code == 'chauffage').gestes[
        'gestes . chauffage . raccordement réseau . chaleur'
      ] = 'Raccordement à un réseau de chaleur'
    }
  })

  const isTravailChecked = (value) => {
    return (
      encodeDottedName(value)
        .split(',')
        .filter((t) => travauxEnvisages.includes(t)).length > 0
    )
  }
  const selectedCategories = situation[
    'projet . définition . catégories travaux envisagées'
  ]
    .replaceAll('"', '')
    .split(',')

  return (
    <>
      {categories
        .filter((categorie) => selectedCategories.includes(categorie['code']))
        .map((categorie) => (
          <fieldset
            key={categorie['code']}
            className="fr-fieldset"
            id={`storybook-form-${categorie['code']}`}
            aria-labelledby="storybook-form-legend storybook-form-messages"
          >
            <legend
              className="fr-fieldset__legend--bold fr-fieldset__legend fr-text"
              css={`
                display: flex;
                gap: 1em;
              `}
            >
              <Image
                src={categorie['image']}
                alt={`Icone représentant une maison`}
              />
              {categorie['titre']} :<br />
              {categorie['question']}
            </legend>
            {Object.entries(categorie.gestes).map((item) => {
              return (
                <div className="fr-fieldset__element" key={item[0]}>
                  <div
                    className="fr-checkbox-group fr-checkbox-rich"
                    key={item[0]}
                  >
                    <input
                      name={`checkbox-${categorie['code']}`}
                      type="checkbox"
                      id={`checkbox-${item[0]}`}
                      onChange={() =>
                        handleCheckTravaux(item[0], situation, setSearchParams)
                      }
                      value={item[0]}
                      checked={isTravailChecked(item[0])}
                    />
                    <label className="fr-label" htmlFor={`checkbox-${item[0]}`}>
                      {item[1]}
                    </label>
                  </div>
                </div>
              )
            })}
          </fieldset>
        ))}
      <FormButtons
        {...{
          currentValue: situation[rule],
          setSearchParams,
          encodeSituation,
          answeredQuestions,
          questionsToSubmit: selectedCategories.includes('chauffage')
            ? []
            : [rule],
          currentQuestion: rule,
          situation,
          specificNextUrl: selectedCategories.includes('chauffage')
            ? setSearchParams(
                { objectif: 'projet.définition.travaux envisagés chauffage' },
                'url',
              )
            : null,
        }}
      />
    </>
  )
}
