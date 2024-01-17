'use client'
import DPE from './DPE2'
import { encodeSituation } from './publicodes/situationUtils'
import data from '@/components/DPE.yaml'
import css from './css/convertToJs'
import DPELabel from './DPELabel'
import { formatValue } from '@/node_modules/publicodes/dist/index'

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
          li {
            margin: 0.6rem 0;
          }
        }
      `}
    >
      <h2>Quel est votre projet de rénovation globale ?</h2>
      <p>Voici vos scénarios de sauts de DPE et l'aide correspondante : </p>
      <ol>
        {possibilities.map((el, index) => (
          <li key={el.lettre}>
            {-index + oldIndex} <DPELabel index={oldIndex} /> ⟶{' '}
            <DPELabel index={index} />{' '}
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
      <div>
        <label>
          Votre investissement{' '}
          <input
            type="number"
            placeholder="12 000 €"
            value={
              situation['investissement'] ||
              rules['investissement']['par défaut']
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
          />
        </label>
        <p>
          En tant que ménage modeste ou très modeste, France Rénov avancera 8
          400 € sur les 12 000 €.
        </p>
      </div>
    </div>
  )
}

const Value = ({ engine, index, situation, dottedName }) => {
  const evaluation = engine.setSituation(situation).evaluate(dottedName),
    value = formatValue(evaluation)
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
