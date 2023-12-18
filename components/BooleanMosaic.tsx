import css from './css/convertToJs'
import { getRuleName } from './publicodes/utils'

export default function BooleanMosaic({
  rules,
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
              value={Math.random() > 0.5 ? true : false}
              onChange={() => console.log('set situation', dottedName)}
            />
            {questionRule.titre || getRuleName(dottedName)}
          </label>
        ))}
      </fieldset>
    </div>
  )
}
