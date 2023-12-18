import css from './css/convertToJs'
import { encodeSituation } from './publicodes/situationUtils'
import { getRuleName } from './publicodes/utils'

export const isMosaicQuestion = (currentQuestion, rule) =>
  currentQuestion.startsWith('gestes . ') &&
  ['oui', 'non'].includes(rule['par défaut'])

export const mosaicQuestionText = (rules, currentQuestion) => {
  return rules['gestes . montant'].question.mosaïque
}
export default function BooleanMosaic({
  rules,
  setSearchParams,
  rule,
  engine,
  situation,
  answeredQuestions,
}) {
  const questions = Object.entries(rules).filter(
    ([dottedName]) =>
      dottedName.startsWith('gestes . ') &&
      dottedName.split(' . ').length === 3,
  )

  return (
    <div>
      <fieldset
        style={css`
          display: flex;
          flex-wrap: wrap;
        `}
      >
        {questions.map(([dottedName, questionRule]) => (
          <label
            key={dottedName}
            style={css`
              margin: 0 1rem;
              width: 16rem;
            `}
          >
            <input
              style={css`
                margin-right: 1rem;
              `}
              type="checkbox"
              checked={situation[dottedName] === 'oui'}
              value={Math.random() > 0.5 ? true : false}
              onChange={() => {
                const encodedSituation = encodeSituation(
                  {
                    ...situation,
                    [dottedName]:
                      situation[dottedName] === 'oui' ? 'non' : 'oui',
                  },
                  false,
                  answeredQuestions,
                )
                console.log(
                  'on change will set encodedSituation',
                  encodedSituation,
                )

                setSearchParams(encodedSituation, false, false)
                console.log('set situation', dottedName)
              }}
            />
            {questionRule.titre || getRuleName(dottedName)}
          </label>
        ))}
      </fieldset>
    </div>
  )
}
