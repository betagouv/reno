import { compute } from './Aide'
import { Key } from './ExplicationUI'
import rules from '@/app/rules'

export default function Value({
  engine,
  evaluation: givenEvaluation,
  name,
  display = (v) => v,
}) {
  const evaluation = givenEvaluation || compute(name, engine, rules)
  console.log(name, evaluation)
  return (
    <Key $state={evaluation.hasMissing ? 'inProgress' : 'final'}>
      {display(evaluation.node.nodeValue)}
    </Key>
  )
}
