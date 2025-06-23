'use client'

import { useState } from 'react'
import React from 'react'
import 'react-tooltip/dist/react-tooltip.css'
import styled from 'styled-components'
import isolationGeste from '@/public/isolation_geste.svg'
import ventilationGeste from '@/public/ventilation_geste.svg'
import chauffageGeste from '@/public/chauffage_geste.svg'
import solaireGeste from '@/public/solaire_geste.svg'
import Image from 'next/image'
import {
  decodeDottedName,
  encodeDottedName,
  encodeSituation,
} from './publicodes/situationUtils'
import { omit } from './utils'

export const categories = [
  {
    code: 'isolation',
    titre: 'Isolation thermique',
    sousTitre: 'Murs, plancher, toit, portes et fenêtres',
    image: isolationGeste,
  },
  {
    code: 'ventilation',
    titre: 'Ventilation',
    sousTitre: 'VMC',
    image: ventilationGeste,
  },
  {
    code: 'chauffage',
    titre: 'Chauffage',
    sousTitre: 'Pompe à chaleur, poêle, chauffe-eau...',
    image: chauffageGeste,
  },
  {
    code: 'solaire',
    titre: 'Solutions solaires',
    image: solaireGeste,
  },
]
export default function ChoixCategorieTravaux({
  situation,
  answeredQuestions,
  setSearchParams,
}) {
  const rule = 'projet . définition . catégories travaux envisagées'
  const [categoriesCochees, setCategoriesCochees] = useState(
    situation[rule].replaceAll('"', '').split(','),
  )
  const handleCheckCategorie = (categorie) => {
    setCategoriesCochees((prev) => {
      const newCategories = prev.includes(categorie)
        ? prev.filter((c) => c !== categorie)
        : [...prev, categorie]
      if (newCategories.length) {
        setSearchParams({
          [encodeDottedName(rule)]: '"' + newCategories.join(',') + '"',
        })
      } else {
        setSearchParams(
          {
            ...encodeSituation(
              omit([rule], situation),
              false,
              answeredQuestions,
            ),
          },
          'url',
          true,
        )
      }

      return newCategories
    })
  }

  return (
    <>
      <Accordion>
        {categories.map((categorie) => (
          <section>
            <h3>
              <input
                type="checkbox"
                onChange={() => handleCheckCategorie(categorie.code)}
                checked={categoriesCochees.includes(categorie.code)}
              />
              <span>
                {categorie.titre}
                {categorie.sousTitre && (
                  <span className="sousTitre">{categorie.sousTitre}</span>
                )}
              </span>
            </h3>
            <Image
              src={categorie.image}
              alt={`Icone ${categorie.titre} d'une maison`}
            />
          </section>
        ))}
      </Accordion>
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
    padding: 1rem;
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
`
