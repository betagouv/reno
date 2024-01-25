'use client'
import DPE from './DPE2'
import { encodeSituation } from './publicodes/situationUtils'
import data from '@/components/DPE.yaml'
import css from './css/convertToJs'
import DPELabel from './DPELabel'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import ExplanationValue from '@/components/explications/Value'
import { compute } from './explications/Aide'
import { Card, CTA, CTAWrapper } from './UI'
import Image from 'next/image'
import Input from './Input'
import styled from 'styled-components'

console.log('DPE data', data)

export default function ScenariosSelector({
  setSearchParams,
  situation,
  currentQuestion,
  answeredQuestions,
  engine,
  rules,
}) {
  const numericalValue = situation[currentQuestion]

  console.log(situation, numericalValue, currentQuestion)

  const doSetSearchParams = (value) => {
    const newSituation = encodeSituation(
      {
        ...situation,
        [currentQuestion]: value,
      },
      false,
      answeredQuestions,
    )
    const url = setSearchParams(newSituation, 'url', false)
  }
  const isNew = currentQuestion === 'DPE . visé' ? numericalValue : null,
    newLetter = numericalValue && data[+numericalValue - 1].lettre,
    oldLetter = isNew && data[+situation['DPE . actuel'] - 1].lettre

  const oldIndex = +situation['DPE . actuel'] - 1,
    possibilities = data.filter((el, index) => index <= oldIndex - 2)

  return (
    <div
      css={`
        margin-top: 0.6rem;
        ol {
          margin-top: 1vh;
          list-style-type: none;
          padding: 0;
          border: 1px solid var(--lighterColor);
          border-radius: 0.3rem;
          li {
            padding: 1.2rem 1vw;
            display: flex;
            justify-content: space-evenly;
            border-bottom: 1px solid var(--lighterColor);
          }
          li:first-child {
            background: var(--lightestColor);
            padding: 0.4rem 1vw;
            font-size: 90%;
          }
          li:last-child {
            margin-bottom: 0;
            border-bottom: none;
          }
        }
      `}
    >
      <h2>Quel est votre projet de rénovation globale ?</h2>
      <p>Voici vos scénarios de sauts de DPE et les aides correspondantes : </p>
      <ol>
        <li key="en-tête">
          <span>Scénario de sauts DPE</span>
          <span>Aide (en %)</span>
          <span>Aide (en €)</span>
          <span>Montant des travaux</span>
        </li>
        {possibilities.map((el, index) => (
          <li key={el.lettre}>
            <span>
              <DPELabel index={oldIndex} />{' '}
              <span
                css={`
                  position: relative;
                `}
              >
                <small
                  css={`
                    position: absolute;
                    left: 40%;
                    top: -0.3rem;
                    transform: translateX(-50%);
                    color: #555;
                    font-size: 70%;
                  `}
                >
                  +{-index + oldIndex}
                </small>
                {'⟶ '}
              </span>
              <DPELabel index={index} />{' '}
            </span>
            <Value
              {...{
                engine,
                index,
                situation: { ...situation, 'DPE . visé': index },
                dottedName: 'MPR . accompagnée . pourcent écrêté',
              }}
            />
            <Value
              {...{
                engine,
                index,
                situation: { ...situation, 'DPE . visé': index },
                dottedName: 'MPR . accompagnée . montant',
              }}
            />
            <Value
              {...{
                engine,
                index,
                situation: { ...situation, 'DPE . visé': index },
                dottedName: 'travaux',
              }}
            />
          </li>
        ))}
      </ol>
      <Card
        css={`
          padding: 1rem;
          margin: 1rem auto;
          text-align: center;
          input {
            width: 6rem;
            text-align: right;
          }
          width: 34rem;
          max-width: 100%;
          img {
            width: 3.5rem;
            height: auto;
            margin-right: 1rem;
          }
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          flex-wrap: wrap;
          label {
            span {
              display: inline-block;
              margin: 0.4rem;
            }
          }
        `}
      >
        <Image
          src="/investissement.svg"
          width="30"
          height="30"
          alt="Icône représentant votre apport personnel qui sera complété par les aides"
        />
        <div
          css={`
            display: flex;
            flex-direction: column;
            align-items: end;
            max-width: 25rem;
          `}
        >
          <label>
            <span>
              Votre investissement <strong>net</strong>
            </span>
            <Input
              value={
                situation['investissement'] ||
                rules['investissement']['par défaut'].split(' €')[0]
              }
              onChange={(value) => {
                setSearchParams(
                  {
                    investissement: value,
                  },
                  'replace',
                  false,
                )
              }}
              step="100"
            />
            &nbsp;€
          </label>
          <div
            css={`
              margin-top: 0.4rem;
              p {
                line-height: 1.1rem;
                color: #555;
                font-size: 80%;
                @media (min-width: 800px) {
                  text-align: right;
                }
              }
            `}
          >
            <p>
              C'est la part des travaux que vous aurez payée une fois la prime
              rénov' déduite.
            </p>
            <Avance {...{ engine, rules }} />
          </div>
        </div>
      </Card>
      <h2>Je n'arrive pas à me décider</h2>
      <p>
        C'est normal : si vous n'êtes pas encore entouré de professionnels pour
        concrétiser la rénovation en chiffres (coûts et gains), il est difficile
        de choisir entre ces scénarios de sauts qui ouvrent droit à la prime.
      </p>
      <p>
        Bonne nouvelle : l'accompagnement fait partie intégrante de la prime :
        votre <strong>Accompagnateur Rénov'</strong> fera un{' '}
        <AuditStyle>audit énergétique</AuditStyle> de votre logement et vous
        aidera à choisir parmi les scénarios de travaux.
      </p>
      <p>
        <strong></strong>
      </p>
      <h2>Conditions d'éligibilité</h2>
      <p>
        Outre les sauts de classe, votre projet de rénovation devra respecter
        les conditions suivantes :
      </p>
      <ul>
        <li>
          Il est obligatoire de réaliser au moins deux gestes d’isolation (murs,
          fenêtres / menuiserie, sols ou toiture).{' '}
        </li>
        <li>
          Il est impossible d’installer un chauffage fonctionnant
          majoritairement aux énergies fossiles (par ex. chaudière à gaz) ou de
          conserver un chauffage fonctionnant au fioul ou au charbon.
        </li>
      </ul>
      <h2>C'est parti ?</h2>
      <p>
        Vous pouvez maintenant contacter un conseiller France Rénov'. Cela ne
        vous engage à rien.
      </p>
      <CTAWrapper>
        <CTA href="https://france-renov.gouv.fr">Contacter un conseiller</CTA>
      </CTAWrapper>
    </div>
  )
}

const AuditStyle = ({ children }) => (
  <span
    css={`
      width: 6rem;
      position: relative;
      background: linear-gradient(to right, #eb8235, #52b153);
      padding: 0;
      padding-bottom: 0.3rem;
      > span {
        background: white;
        color: black;
        padding: 0 0.3rem;
      }
    `}
  >
    <span>{children}</span>
  </span>
)
const Avance = ({ engine, rules }) => {
  const evaluation = compute('ménage . revenu . classe', engine, rules)
  if (!['modeste', 'très modeste'].includes(evaluation.value)) return null
  return (
    <p>
      En tant que ménage au revenu <ExplanationValue {...{ evaluation }} />,
      vous pourrez bénéficier d'une avance de <strong>70 %</strong>.
    </p>
  )
}

const Value = ({ engine, index, situation, dottedName }) => {
  const evaluation = engine.setSituation(situation).evaluate(dottedName),
    value = formatValue(evaluation, { precision: 0 })
  return (
    <span
      css={`
        margin-left: 1rem;
      `}
    >
      {value}
    </span>
  )
}
