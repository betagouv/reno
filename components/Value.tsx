import { formatValue } from 'publicodes'
import Badge from '@codegouvfr/react-dsfr/Badge'

export default ({
  engine,
  situation,
  dottedName,
  size,
  state = 'none',
  addOn,
}) => {
  const evaluation = engine.setSituation(situation).evaluate(dottedName),
    value = formatValue(evaluation, { precision: 0 })
  const missingVariables = evaluation.missingVariables
  const missing = Object.entries(missingVariables)

  return state == 'normal' ? (
    <strong>{value != 'Pas encore défini' ? value : '...'}</strong>
  ) : (
    <Badge
      noIcon
      className={className + (size == 'xl' ? ' fr-h3' : '')}
      severity={
        state != 'none' ? state : missing.length > 0 ? state : 'success'
      }
    >
      {value != 'Pas encore défini' ? value : '...'}
      {addOn && <> {addOn}</>}
    </Badge>
  )
}
