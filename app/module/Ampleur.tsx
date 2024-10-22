'use client'
import rules from '@/app/règles/rules'
import DPELabel from '@/components/DPELabel'
import DPEQuickSwitch from '@/components/DPEQuickSwitch'
import { CTA, PrimeStyle, Card } from '@/components/UI'
import {
  encodeDottedName,
  encodeSituation,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import { roundToThousands } from '@/components/utils'
import logoFranceRenov from '@/public/logo-france-renov-sans-texte.svg'
import marianne from '@/public/marianne.svg'
import dotIcon from '@/public/point.svg'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import Publicodes from 'publicodes'
import { useMemo } from 'react'
import styled from 'styled-components'
import { BlueEm, Labels } from '../LandingUI'
import personas from './examplePersonas.yaml'
import Select from '@/components/Select'
import { usageLogement, usageLogementValues } from './AmpleurInputs'
import rightArrow from '@/public/flèche-vers-droite.svg'

const engine = new Publicodes(rules)

export default function Ampleur() {
  const setSearchParams = useSetSearchParams()

  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const { persona: selectedPersona = 0, ...situationSearchParams } =
    searchParams

  const userSituation = getSituation(situationSearchParams, rules)
  const personaSituation = personas[selectedPersona].situation
  const currentDPE = +personaSituation['DPE . actuel']
  const targetDPE =
    +userSituation['projet . DPE visé'] || Math.max(currentDPE - 2, 1)

  const defaultSituation = {
    'logement . période de construction': "'de 15 à 25 ans'",
    'vous . propriétaire . condition': 'oui',
    'ménage . revenu': 25000, // Le revenu médian est de 20 000, mais le mettre à 25 000 permet de faire en sorte qu'il y ait une différence entre IdF et hors IdF pour que la case à cocher ait un effet
    'ménage . personnes': 2,
    'ménage . région . IdF': 'non',
    'logement . résidence principale': 'oui',
    'projet . travaux': 999999,
  }

  const situation = {
    ...defaultSituation,
    ...personaSituation,
    'projet . DPE visé': targetDPE,
    ...userSituation,
  }
  console.log('blue', situation)

  const mpra = useMemo(() => {
    try {
      const evaluation = engine
        .setSituation(situation)
        .evaluate('MPR . accompagnée . montant')
      return evaluation.nodeValue
    } catch (e) {
      console.log(e)
      return e
    }
  }, [situation])

  const onChange =
    (dottedName) =>
    ({ target: { value } }) =>
      setSearchParams({
        [encodeDottedName(dottedName)]: value + '*',
      })

  return (
    <div
      css={`
        background: white;
        padding: 1rem;
        height: 800px;
        position: relative;
        h2 + hr {
          width: 4rem;
          background: var(--color);
          height: 4px;
          margin-bottom: 2.6rem;
        }
        h2,
        h3 {
          font-size: 140%;
          font-weight: 500;
        }
        h2 {
          margin-top: 0.6rem;
          margin-bottom: 0.8rem;
          font-size: 160%;
          font-weight: 600;
        }
        h3 {
          margin-bottom: 0.6rem;
        }
      `}
    >
      <Labels
        css={`
          margin: 0;
        `}
      >
        {['⚡️ En 2024, les aides évoluent'].map((text) => (
          <li key={text}>{text}</li>
        ))}
      </Labels>
      <h2>
        Quelles <BlueEm>aides</BlueEm> pour une rénovation d'ampleur ?
      </h2>
      <hr />
      <ul
        css={`
          list-style-type: none;
          @media (max-width: 420px) {
            padding-left: 0;
          }
          li {
            margin: 1.2rem 0;
            display: flex;
            align-items: center;
            input {
              min-width: 1.4rem;
              min-height: 1.4rem;
              margin-right: 0.6rem;
            }
            label {
              cursor: pointer;
            }
            img {
              width: 1rem;
              height: auto;
              margin-right: 0.6rem;
            }
          }
        `}
      >
        <li>
          <Dot />
          <label htmlFor="">
            Ce logement sera :{' '}
            <Select
              onChange={(e) => {
                alert(e)
                const encodedSituation = encodeSituation(
                  {
                    ...situation,
                    ...usageLogementValues.find(({ valeur }) => valeur == e)
                      .situation,
                  },
                  false,
                  //answeredQuestions,
                )
                setSearchParams(encodedSituation, 'replace', false)
              }}
              value={usageLogement(situation)}
              values={usageLogementValues}
            />
          </label>
        </li>
        <li key="personnes">
          <Dot />
          <label>
            <span>Votre ménage est composé de </span>{' '}
            <input
              type="number"
              min="1"
              placeholder={defaultSituation['ménage . personnes']}
              onChange={onChange('ménage . personnes')}
              css={`
                width: 4rem !important;
              `}
            />{' '}
            personnes
          </label>
        </li>
        <li key="revenu">
          <Dot />
          <label>
            <span>Le revenu fiscal de votre ménage est de </span>{' '}
            <input
              type="number"
              min="0"
              placeholder={defaultSituation['ménage . revenu']}
              onChange={onChange('ménage . revenu')}
              css={`
                width: 5rem !important;
              `}
            />{' '}
            €
          </label>
        </li>
        <li
          css={`
            > section {
              margin-left: 1rem;
              label {
                display: inline-flex;
                align-items: center;
                margin-right: 1rem;
              }
              input[type='radio'] {
                width: 1.2rem !important;
                height: 1.2rem !important;
              }
              input[type='radio'],
              input[type='radio'] + label {
                cursor: pointer;
                &:hover {
                  background: var(--lighterColor);
                }
              }
            }
          `}
        >
          <Dot />
          <span>Vous habitez actuellement hors Île-de-France</span>
          <section>
            <label>
              <input
                id={`idf`}
                type="radio"
                checked={situation['ménage . région . IdF'] === 'oui'}
                onChange={() =>
                  setSearchParams({
                    [encodeDottedName('ménage . région . IdF')]: 'oui*',
                  })
                }
              />
              <span>Oui</span>
            </label>
            <label>
              <input
                id={`idf`}
                type="radio"
                checked={situation['ménage . région . IdF'] === 'non'}
                onChange={() =>
                  setSearchParams({
                    [encodeDottedName('ménage . région . IdF')]: 'non*',
                  })
                }
              />
              <span>Non</span>
            </label>
          </section>
        </li>
        <li key="DPE">
          <Dot />
          <label>
            <span>
              Les travaux de rénovation font passer le DPE actuel{' '}
              <DPELabel index={currentDPE - 1} /> vers un{' '}
              <DPEQuickSwitch
                oldIndex={targetDPE - 1}
                prefixText={''}
                dottedName="projet . DPE visé"
              />
              .
            </span>{' '}
          </label>
        </li>
      </ul>
      <h3>Pour ce bien immobilier, vous pouvez toucher :</h3>
      <EvaluationValue>
        <Image
          src={'/investissement.svg'}
          alt="Icône argent dans la main"
          width="10"
          height="10"
        />
        <div>
          <div>
            {mpra > 0 && <span>Jusqu'à </span>}
            <PrimeStyle
              css={`
                margin: 0.2rem 0;
                display: inline-block;
              `}
            >
              {typeof mpra === 'string' ? (
                mpra
              ) : (
                <span>{roundToThousands(mpra).toLocaleString('fr-FR')} €</span>
              )}
            </PrimeStyle>{' '}
            d'aides
          </div>
          <small
            css={`
              display: block;
              font-size: 70%;
              margin: 0 auto;
              margin-top: 0.4rem;
            `}
          >
            avec{' '}
            <BlueEm>
              <strong>MaPrimeRénov'</strong>
            </BlueEm>{' '}
          </small>{' '}
        </div>
      </EvaluationValue>
      <section
        css={`
          margin-bottom: 0;
          display: flex;
          @media (max-width: 420px) {
            flex-wrap: wrap;
          }
          align-items: center;
          background: var(--lightestColor);
          justify-content: space-evenly;
          padding: 1.2rem 1rem;
          p {
            margin: 0;
            margin-bottom: 0.5rem;
          }
          margin-top: 2rem;
        `}
      >
        <p>
          Découvrez toutes les aides pour une rénovation énergétique de votre
          logement
        </p>
        <CTA
          css={`
            margin-bottom: 0;
            a  {
              display: flex;
              font-size: 85% !important;
              align-items: center;
              img {
                height: 2rem;
                width: auto;
                margin-right: 0.6rem;
              }
            }
          `}
        >
          <a
            target="_blank"
            href={`https://mesaidesreno.beta.gouv.fr/simulation?${new URLSearchParams(situationSearchParams).toString()}`}
          >
            <span>➞&nbsp;&nbsp;J'affine ma simulation</span>
          </a>
        </CTA>
      </section>

      <footer
        css={`
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: -1rem;
          margin-top: 1rem;

          > img {
            height: 5.5rem;
            width: auto;
            margin-right: 1rem;
          }
          p {
            margin: 0;
            margin-left: 2rem;
          }
          margin-top: 1rem;
        `}
      >
        <Image
          src={marianne}
          alt="Iconographie officielle Marianne, symbole de la république française"
        />

        <Image
          src={logoFranceRenov}
          alt="Logo de France Rénov"
          css={`
            width: 6.5rem !important;
          `}
        />
      </footer>
    </div>
  )
}

const Dot = () => (
  <Image src={rightArrow} alt="Icône d'une flèche vers la droite" />
)

export const EvaluationValue = styled.div`
  img {
    width: 4rem;
    height: auto;
    margin-right: 1rem;
  }
  margin: 1.6rem auto;
  display: flex;
  align-items: center;
  font-size: 150%;
  width: fit-content;
  background: var(--lightestColor);
  border-bottom: 4px solid var(--color);

  padding: 1rem 2rem;
  text-align: center;
  small {
    margin-bottom: 0.4rem;
  }
`
