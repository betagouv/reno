'use client'

import styled from 'styled-components'
import Image from 'next/image'
import { encodeDottedName } from './publicodes/situationUtils'
import { categories } from './utils'

export default function ChoixCategorieTravaux({ situation, setSearchParams }) {
  const rule = 'projet . définition . catégories travaux envisagées'
  const categoriesCochees =
    situation[rule]?.replaceAll('"', '').split(',') || []
  const handleCheckCategorie = (categorie) => {
    const newCategories = categoriesCochees.includes(categorie)
      ? categoriesCochees.filter((c) => c !== categorie)
      : [...categoriesCochees, categorie]
    setSearchParams(
      {
        [encodeDottedName(rule)]: newCategories.length
          ? '"' + newCategories.join(',') + '"'
          : undefined,
      },
      'push',
      false,
    )
  }

  return (
    <>
      <Accordion>
        {categories.map((categorie) => (
          <section key={categorie.code}>
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
