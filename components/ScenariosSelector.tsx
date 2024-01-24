'use client'
import DPE from './DPE2'
import { encodeSituation } from './publicodes/situationUtils'
import data from '@/components/DPE.yaml'
import css from './css/convertToJs'
import DPELabel from './DPELabel'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import ExplanationValue from '@/components/explications/Value'
import { compute } from './explications/Aide'
import { Card } from './UI'

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
    const url = setSearchParams(newSituation, false, false)
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
          list-style-type: none;
          padding: 0;
          border: 1px solid var(--lighterColor);
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
        `}
      >
        <label>
          Votre investissement{' '}
          <input
            type="number"
            value={
              situation['investissement'] ||
              rules['investissement']['par défaut'].split(' €')[0]
            }
            onChange={(e) => {
              setSearchParams(
                {
                  investissement: e.target.value,
                },
                false,
                false,
              )
            }}
          />{' '}
          €
        </label>
      </Card>
      {/*
      <Avance {...{ engine, rules }} />
	  */}
    </div>
  )
}
const Avance = ({ engine, rules }) => {
  const evaluation = compute('ménage . revenu . classe', engine, rules)
  if (!['modeste', 'très modeste'].includes(evaluation.value)) return null
  return (
    <div>
      <p>
        En tant que ménage au revenu <ExplanationValue {...{ evaluation }} />,
        France Rénov pourra avancer 70 % de l'aide soit x sur y.
      </p>
    </div>
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
