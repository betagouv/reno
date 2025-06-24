'use client'

import { useState } from 'react'
import styled from 'styled-components'
import isolationGeste from '@/public/isolation_geste.svg'
import ventilationGeste from '@/public/ventilation_geste.svg'
import chauffageGeste from '@/public/chauffage_geste.svg'
import solaireGeste from '@/public/solaire_geste.svg'
import Image from 'next/image'
import { encodeDottedName } from './publicodes/situationUtils'

export const categories = [
  {
    code: 'isolation',
    titre: 'Isolation thermique',
    question: 'Quels problèmes constatez-vous ?',
    sousTitre: 'Murs, plancher, toit, portes et fenêtres',
    image: isolationGeste,
    gestes: {
      'gestes . isolation . murs extérieurs,gestes . isolation . murs intérieurs':
        'Murs mal isolés ou froids au toucher',
      'gestes . isolation . rampants': 'Toiture ou combles mal isolés',
      'gestes . isolation . toitures terrasses':
        'Toit plat mal isolé, surchauffe en été',
      'gestes . isolation . plancher bas': 'Sensation de froid venant du sol',
      'gestes . isolation . vitres': 'Simple vitrage ou fenêtres anciennes',
    },
  },
  {
    code: 'ventilation',
    titre: 'Ventilation',
    question: 'Quelles options vous intéressent ?',
    sousTitre: 'VMC',
    image: ventilationGeste,
    gestes: {
      'gestes . ventilation . double flux': 'Ventilation double flux',
      'gestes . chauffage . PAC . air-air': 'Pompe à chaleur air-air',
    },
  },
  {
    code: 'chauffage',
    titre: 'Chauffage',
    question: 'Quelles options vous intéressent ?',
    sousTitre: 'Pompe à chaleur, poêle, chauffe-eau...',
    image: chauffageGeste,
    gestes: {
      'gestes . chauffage . PAC': 'Pompe à chaleur',
      'gestes . chauffage . bois . chaudière': 'Chaudière',
      'gestes . chauffage . bois': 'Poêles et insert',
      'gestes . chauffage . chauffe-eau thermodynamique': 'Chauffe-eau',
      'gestes . chauffage . fioul . dépose cuve': 'Dépose de cuve à fioul',
    },
  },
  {
    code: 'solaire',
    titre: 'Solutions solaires',
    question: 'Quelles options vous intéressent ?',
    image: solaireGeste,
    gestes: {
      'gestes . chauffage . solaire . chauffe-eau solaire':
        'Chauffe-eau solaire',
      'gestes . chauffage . solaire . solaire combiné':
        'Chauffage solaire combiné',
      'gestes . chauffage . solaire . partie thermique PVT eau':
        "Partie thermique d'un équipement PVT eau",
    },
  },
]
export default function ChoixCategorieTravaux({ situation, setSearchParams }) {
  const rule = 'projet . définition . catégories travaux envisagées'
  const [categoriesCochees, setCategoriesCochees] = useState(
    situation[rule]?.replaceAll('"', '').split(',') || [],
  )
  const handleCheckCategorie = (categorie) => {
    setCategoriesCochees((prev) => {
      const newCategories = prev.includes(categorie)
        ? prev.filter((c) => c !== categorie)
        : [...prev, categorie]
      setSearchParams(
        {
          [encodeDottedName(rule)]: newCategories.length
            ? '"' + newCategories.join(',') + '"'
            : undefined,
        },
        'push',
        false,
      )

      return newCategories
    })
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
