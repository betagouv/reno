import ExplanationValue from '@/components/explications/Value'
import Value from '@/components/Value'
import { compute } from '@/components/explications/Aide'

export default ({ engine, rules, choice, situation }) => {
  const evaluation = compute('ménage . revenu . classe', engine, rules)
  if (!['modeste', 'très modeste'].includes(evaluation.value))
    return (
      <div>
        <p>Cette aide sera un remboursement</p>
        <small> vous devrez avancer l'argent des travaux.</small>
      </div>
    )
  return (
    <ol>
      <li>
        Une avance de{' '}
        <Value
          {...{
            engine,
            choice,
            situation: { ...situation, 'projet . DPE visé': choice + 1 },
            dottedName: 'MPR . accompagnée . avance',
            state: 'final',
          }}
        />{' '}
        <span>
          (70&nbsp;%) en tant que ménage
          <ExplanationValue {...{ evaluation, state: 'none' }} />
        </span>
      </li>
      <li>
        Un remboursement de{' '}
        <Value
          {...{
            engine,
            choice,
            situation: { ...situation, 'projet . DPE visé': choice + 1 },
            dottedName: 'MPR . accompagnée . remboursement',
            state: 'final',
          }}
        />{' '}
        <span>(30&nbsp;%)</span> après les travaux
      </li>
    </ol>
  )
}
