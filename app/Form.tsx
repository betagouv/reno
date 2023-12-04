import rules from './règles.yaml'

import Publicodes from 'publicodes'
import { formatValue } from '@/node_modules/publicodes/dist/index'

const engine = new Publicodes(rules)

export default function () {
  const evaluation = engine.evaluate('aides'),
    value = formatValue(evaluation)

  return <div>{value}</div>
}
