'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import React from 'react'
import 'react-tooltip/dist/react-tooltip.css'
import styled from 'styled-components'
import isolationGeste from '@/public/isolation_geste.svg'
import ventilationGeste from '@/public/ventilation_geste.svg'
import chauffageGeste from '@/public/chauffage_geste.svg'
import Image from 'next/image'
import {
  decodeDottedName,
  encodeDottedName,
  encodeSituation,
} from './publicodes/situationUtils'
import { omit } from './utils'

export const getTravauxEnvisages = (situation) =>
  situation['projet . travaux envisagés']
    ?.split(',')
    .map((t) => t.replaceAll('"', '')) || []

export const gestes = {
  isolation: {
    'gestes . isolation . murs extérieurs,gestes . isolation . murs intérieurs':
      'Murs mal isolés ou froids au toucher',
    'gestes . isolation . rampants': 'Toiture ou combles mal isolés',
    'gestes . isolation . toitures terrasses':
      'Toit plat mal isolé, surchauffe en été',
    'gestes . isolation . plancher bas': 'Sensation de froid venant du sol',
    'gestes . isolation . vitres': 'Simple vitrage ou fenêtres anciennes',
  },
  chauffage: {
    'gestes . chauffage . PAC': 'Pompe à chaleur',
    'gestes . chauffage . bois . chaudière': 'Chaudière',
    'gestes . chauffage . bois': 'Poêles et insert',
    'gestes . chauffage . chauffe-eau thermodynamique': 'Chauffe-eau',
  },
  ventilation: {
    'gestes . ventilation . double flux': 'Ventilation double flux',
  },
}
export const isCategorieChecked = (
  categorie,
  travauxEnvisages,
  categoriesCochees,
) =>
  (typeof categoriesCochees !== 'undefined' &&
    categoriesCochees.includes(categorie)) ||
  Object.keys(gestes[categorie]).filter(
    (value) =>
      value
        .split(',')
        .filter((t) => travauxEnvisages?.includes(encodeDottedName(t))).length,
  ).length

export const handleCheckTravaux = (
  geste,
  situation,
  setSearchParams,
  answeredQuestions,
) => {
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

  updateTravaux(situation, setSearchParams, travauxEnvisages, answeredQuestions)
}

export const updateTravaux = (
  situation,
  setSearchParams,
  travauxEnvisages,
  answeredQuestions,
) => {
  const encodedSituation = encodeSituation(
    !travauxEnvisages.length
      ? omit(['projet . travaux envisagés'], situation)
      : {
          ...situation,
          ['projet . travaux envisagés']: `"${travauxEnvisages.join(',')}"`,
        },
    false,
    answeredQuestions,
  )

  setSearchParams(encodedSituation, 'replace', true)
}

export default function ChoixTravaux({
  situation,
  rules,
  engine,
  answeredQuestions,
  setSearchParams,
}) {
  const [categoriesCochees, setCategoriesCochees] = useState([])
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 400,
  )
  let travauxEnvisages = getTravauxEnvisages(situation)

  const handleCheckCategorie = (categorie) => {
    if (isCategorieChecked(categorie, travauxEnvisages, categoriesCochees)) {
      travauxEnvisages = travauxEnvisages?.filter(
        (t) => !Object.keys(gestes[categorie]).includes(decodeDottedName(t)),
      )
      setCategoriesCochees((prev) => prev.filter((c) => c != categorie))
      updateTravaux(
        situation,
        setSearchParams,
        travauxEnvisages,
        answeredQuestions,
      )
    } else {
      setCategoriesCochees((prev) => [...prev, categorie])
    }
  }

  const isTravailChecked = (value) => {
    return (
      encodeDottedName(value)
        .split(',')
        .filter((t) => travauxEnvisages.includes(t)).length > 0
    )
  }

  return (
    <>
      <Accordion>
        <section>
          <h3>
            <input
              type="checkbox"
              onChange={() => handleCheckCategorie('isolation')}
              checked={isCategorieChecked(
                'isolation',
                travauxEnvisages,
                categoriesCochees,
              )}
            />
            <span>
              Isolation thermique
              <span className="sousTitre">
                Murs, plancher, toit, portes et fenêtres
              </span>
            </span>
          </h3>
          <Image src={isolationGeste} alt="Icone d'isolation d'une maison" />
        </section>
        <section>
          <h3>
            <input
              type="checkbox"
              onChange={() => {
                handleCheckCategorie('ventilation')
                handleCheckTravaux(
                  'gestes . ventilation . double flux',
                  situation,
                  setSearchParams,
                  answeredQuestions,
                )
              }}
              checked={isCategorieChecked(
                'ventilation',
                travauxEnvisages,
                categoriesCochees,
              )}
            />
            <span>
              Ventilation
              <span className="sousTitre">VMC</span>
            </span>
          </h3>
          <Image
            src={ventilationGeste}
            alt="Icone représentant la ventilation d'une maison"
          />
        </section>
        <section>
          <h3>
            <input
              type="checkbox"
              onChange={() => handleCheckCategorie('chauffage')}
              checked={isCategorieChecked(
                'chauffage',
                travauxEnvisages,
                categoriesCochees,
              )}
            />
            <span>
              Chauffage et eau chaude
              <span className="sousTitre">
                Pompe à chaleur, poêle, chauffe-eau...
              </span>
            </span>
          </h3>
          <Image
            src={chauffageGeste}
            alt="Icone représentant le chauffage d'une maison"
          />
        </section>
      </Accordion>
      {isCategorieChecked('isolation', travauxEnvisages, categoriesCochees) && (
        <>
          <h4>Isolation : Quels problèmes constatez-vous ?</h4>
          <Accordion geste="true">
            {Object.entries(gestes['isolation']).map((item) => {
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
                          answeredQuestions,
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
        </>
      )}
      {isCategorieChecked('chauffage', travauxEnvisages, categoriesCochees) && (
        <>
          <h4>Chauffages : quelles options vous intéressent ?</h4>
          <Accordion geste="true">
            {Object.entries(gestes['chauffage']).map((item) => {
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
                          answeredQuestions,
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
        </>
      )}
    </>
  )
}

const Accordion = styled.div`
  width: 100%;
  margin-bottom: 1rem;
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
      border-right: 1px solid #dfdff0;
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
