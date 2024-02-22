import Geste, { Prime, safeEngine } from './Geste'
import { gestesMosaicQuestions } from './GestesMosaic'
import Input from './Input'
import InputSwitch from './InputSwitch'
import { encodeSituation } from './publicodes/situationUtils'
import { Card } from './UI'
import useSetSeachParams from './useSetSearchParams'
import { formatValue } from 'publicodes'
import { getQuestionText } from './ClassicQuestionWrapper'

export default function GestesBasket({
  rules,
  rule,
  engine,
  situation,
  answeredQuestions,
  nextQuestions,
  setSearchParams,
}) {
  const gestes = gestesMosaicQuestions.filter((q) => {
    const active = situation[q[0]] === 'oui'
    return active
  })
  console.log('chartreuse', gestes)

  const evaluation = engine
      .setSituation(situation)
      .evaluate('gestes . montant'),
    total = formatValue(evaluation)

  const missingValues = nextQuestions.find(
    (question) =>
      situation[question] == undefined &&
      question !== 'MPR . non accompagnée . confirmation',
  )
  console.log('yellow missing', { missingValues, nextQuestions })
  return (
    <div>
      <h2>Votre panier de gestes</h2>
      <ul
        css={`
          li {
            margin: 1rem 0;
          }
        `}
      >
        {gestes.map((question) => (
          <li key={question[0]}>
            <Card css={``}>
              <Geste {...{ dottedName: question[0], rules }} />
              <Question
                {...{
                  dottedName: question[0],
                  rules,
                  nextQuestions,
                  engine,
                  situation,
                  answeredQuestions,
                }}
              />
            </Card>
          </li>
        ))}
      </ul>
      <div>
        {missingValues && (
          <p>
            💡 Répondez aux questions ci-dessus pour obtenir une estimation de
            l'aide totale.
          </p>
        )}
        <div
          css={`
            margin-top: 0.6rem;
            position: sticky;
            top: 2rem;
            > div {
              text-align: center;
              border: 2px solid #7eb48f;
              padding: 0.2rem 0.4rem;
              background: #c4fad5;
              width: 10rem;
              margin: 0;
              margin-left: auto;
              ${missingValues && `filter: blur(1.5px);`}
            }
          `}
        >
          <div>Estimation totale ~ {total}</div>
        </div>
      </div>
    </div>
  )
}

const Question = ({
  dottedName,
  rules,
  nextQuestions,
  engine,
  situation,
  answeredQuestions,
}) => {
  const question = nextQuestions.find((question) =>
    question.startsWith(dottedName),
  )
  if (!question) return null

  const evaluation = engine.evaluate(question),
    currentValue = situation[question]
  const setSearchParams = useSetSeachParams()
  return (
    <div
      css={`
        margin: 0.6rem 0;
        > label {
          margin: 1rem 0;
          display: flex;
          justify-content: end;
          align-items: center;
          flex-wrap: wrap;
          > div {
            margin-right: 1rem;
          }
        }
      `}
    >
      <label>
        <div>{getQuestionText(rules[question], question, rules)}</div>
        <Input
          type={'number'}
          placeholder={evaluation.nodeValue}
          value={currentValue == null ? undefined : currentValue}
          name={question}
          unit={evaluation.unit}
          onChange={(value) => {
            const encodedSituation = encodeSituation(
              {
                ...situation,
                [question]: value == undefined ? undefined : value,
              },
              false,
              answeredQuestions,
            )

            setSearchParams(encodedSituation, 'push', false)
          }}
        />
      </label>
      <div
        css={`
          text-align: right;
        `}
      >
        <Prime
          value={formatValue(engine.evaluate(dottedName + ' . montant'))}
        />
      </div>
    </div>
  )
}
