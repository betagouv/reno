import { formatValue } from 'publicodes'
import Badge from '@codegouvfr/react-dsfr/Badge'

export default ({ engine, situation, dottedName, size, state = 'none' }) => {
  const evaluation = engine.setSituation(situation).evaluate(dottedName),
    value = formatValue(evaluation, { precision: 0 })
  const missingVariables = evaluation.missingVariables
  const missing = Object.entries(missingVariables)

  return (
    <Badge
      noIcon
      className={size == 'xl' ? 'fr-h3' : ''}
      severity={state || (missing.length > 0 ? 'inProgress' : 'success')}
    >
      {value}
    </Badge>
  )
}
