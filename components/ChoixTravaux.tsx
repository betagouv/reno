'use client'

import styled from 'styled-components'
import Image from 'next/image'
import { encodeDottedName, encodeSituation } from './publicodes/situationUtils'
import FormButtons from '@/app/simulation/FormButtons'
import { categories } from './utils'

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
    <div
      css={`
        h4 {
          display: flex;
          gap: 1rem;
          margin: 2em 0 1em 0;
          &:first-of-type {
            margin-top: 1em;
          }
        }
      `}
    >
      {categories
        .filter((categorie) => selectedCategories.includes(categorie['code']))
        .map((categorie) => (
          <div key={categorie['code']}>
            <h4>
              <Image
                src={categorie['image']}
                alt={`Icone représentant l'isolation d'une maison`}
              />
              {categorie['titre']} :<br /> {categorie['question']}
            </h4>
            <Accordion geste="true">
              {Object.entries(categorie.gestes).map((item) => {
                return (
                  <section key={item[0]}>
                    <h3>
                      <input
                        type="checkbox"
                        onChange={() =>
                          handleCheckTravaux(
                            item[0],
                            situation,
                            setSearchParams,
                          )
                        }
                        value={item[0]}
                        checked={isTravailChecked(item[0])}
                      />
                      <span>{item[1]}</span>
                    </h3>
                  </section>
                )
              })}
            </Accordion>
          </div>
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
    </div>
  )
}

export const Accordion = styled.div`
  width: 100%;
  margin-bottom: 3rem;
  section {
    display: flex;
    gap: 1rem;
    border: 1px solid #dddddd;
    ${(p) =>
      p.geste &&
      'border: 2px solid #dfdff0;border-radius: 5px;margin-bottom: 1rem;'}
    padding: ${(p) => (p.geste ? '0.5rem' : '1rem')};
    > h3 {
      flex-grow: 1;
      font-weight: normal;
      margin: 0;
      font-size: 100%;
      display: flex;
      align-items: center;
      ${(p) => !p.geste && 'border-right: 1px solid #dfdff0;'}
      input {
        width: 1.6rem;
        height: 1.6rem;
        margin-right: 1rem;
        cursor: pointer;
      }
      .sousTitre {
        display: block;
        font-weight: normal;
        color: var(--mutedColor);
      }
    }
    img {
      margin-left: auto;
    }
  }
  .estimer {
    font-weight: normal;
    &:hover {
      background: var(--color);
      color: white;
    }
  }
  .slide-down {
    overflow: hidden;
    max-height: 0;
    transition: max-height 1s ease-out;
  }
  .slide-down.active {
    max-height: fit-content;
    background: white;
  }
  section > .slide-down.active {
    padding: 1rem;
  }
  table {
    width: 100%;
    td {
      border: none;
    }
  }
  tr td:first-of-type > img {
    width: 1rem;
    height: auto;
    margin: 0 0.5rem;
  }
  span {
    cursor: pointer;
  }
`
