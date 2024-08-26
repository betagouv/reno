import { formatValue } from 'publicodes'
import { Key } from './explications/ExplicationUI'

export default ({ engine, situation, dottedName, state = 'none' }) => {
  const evaluation = engine.setSituation(situation).evaluate(dottedName),
    value = formatValue(evaluation, { precision: 0 })
  const missingVariables = evaluation.missingVariables
  const missing = Object.entries(missingVariables)

  console.log('vv', value, missingVariables)

  return (
    <Key $state={state || (missing.length > 0 ? 'inProgress' : 'final')}>
      {false && missing.length > 0 ? (
        <span
          css={`
            display: inline-block;
            padding: 0 1rem;
            background: var(--lighterColor);
            border-radius: 0.3rem;
            font-weight: 300;
          `}
        >
          ... €
        </span>
      ) : (
        value
      )}
    </Key>
  )
}
