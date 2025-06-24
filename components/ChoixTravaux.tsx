'use client'

import styled from 'styled-components'
import isolationGeste from '@/public/isolation_geste.svg'
import chauffageGeste from '@/public/chauffage_geste.svg'
import solaireGeste from '@/public/solaire_geste.svg'
import ventilationGeste from '@/public/solaire_geste.svg'
import Image from 'next/image'
import { encodeDottedName, encodeSituation } from './publicodes/situationUtils'
import FormButtons from '@/app/simulation/FormButtons'

export const getTravauxEnvisages = (situation) =>
  situation['projet . définition . travaux envisagés']
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
    'gestes . chauffage . fioul . dépose cuve': 'Dépose de cuve à fioul',
  },
  ventilation: {
    'gestes . ventilation . double flux': 'Ventilation double flux',
    'gestes . chauffage . PAC . air-air': 'Pompe à chaleur air-air',
  },
  solaire: {
    'gestes . chauffage . solaire . chauffe-eau solaire': 'Chauffe-eau solaire',
    'gestes . chauffage . solaire . solaire combiné':
      'Chauffage solaire combiné',
    'gestes . chauffage . solaire . partie thermique PVT eau':
      "Partie thermique d'un équipement PVT eau",
  },
}
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
      gestes.chauffage['gestes . chauffage . raccordement réseau . chaleur'] =
        'Raccordement à un réseau de chaleur'
    }
  })

  const isTravailChecked = (value) => {
    return (
      encodeDottedName(value)
        .split(',')
        .filter((t) => travauxEnvisages.includes(t)).length > 0
    )
  }
  const categories = situation[
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
      {categories.includes('isolation') && (
        <>
          <h4>
            <Image
              src={isolationGeste}
              alt={`Icone représentant l'isolation d'une maison`}
            />
            Isolation :<br /> Quels problèmes constatez-vous ?
          </h4>
          <Accordion geste="true">
            {Object.entries(gestes['isolation']).map((item) => {
              return (
                <section key={item[0]}>
                  <h3>
                    <input
                      type="checkbox"
                      onChange={() =>
                        handleCheckTravaux(item[0], situation, setSearchParams)
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
      {categories.includes('chauffage') && (
        <>
          <h4>
            <Image
              src={chauffageGeste}
              alt={`Icone représentant le chauffage d'une maison`}
            />
            Chauffages :<br /> Quelles options vous intéressent ?
          </h4>
          <Accordion geste="true">
            {Object.entries(gestes['chauffage']).map((item) => {
              return (
                <section key={item[0]}>
                  <h3>
                    <input
                      type="checkbox"
                      onChange={() =>
                        handleCheckTravaux(item[0], situation, setSearchParams)
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
      {categories.includes('solaire') && (
        <>
          <h4>
            <Image
              src={solaireGeste}
              alt={`Icone représentant le chauffage d'une maison`}
            />
            Solutions solaires :<br /> Quelles options vous intéressent ?
          </h4>
          <Accordion geste="true">
            {Object.entries(gestes['solaire']).map((item) => {
              return (
                <section key={item[0]}>
                  <h3>
                    <input
                      type="checkbox"
                      onChange={() =>
                        handleCheckTravaux(item[0], situation, setSearchParams)
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
      {categories.includes('ventilation') && (
        <>
          <h4>
            <Image
              src={ventilationGeste}
              alt={`Icone représentant la ventilation d'une maison`}
            />
            Ventilation :<br /> Quelles options vous intéressent ?
          </h4>
          <Accordion geste="true">
            {Object.entries(gestes['ventilation']).map((item) => {
              return (
                <section key={item[0]}>
                  <h3>
                    <input
                      type="checkbox"
                      onChange={() =>
                        handleCheckTravaux(item[0], situation, setSearchParams)
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
      <FormButtons
        {...{
          currentValue: situation[rule],
          setSearchParams,
          encodeSituation,
          answeredQuestions,
          questionsToSubmit: categories.includes('chauffage') ? [] : [rule],
          currentQuestion: rule,
          situation,
          specificNextUrl: categories.includes('chauffage')
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
