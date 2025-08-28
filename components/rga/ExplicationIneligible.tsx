import rules from '@/app/règles/rules'
import styled from 'styled-components'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
const rule = rules['copropriété . condition éligibilité']
const conditions = Object.entries(rule['toutes ces conditions'])

export default function ExplicationsCoproIneligible({ engine, situation }) {
  const evaluate = (dottedName) =>
    engine.setSituation(situation).evaluate(dottedName).nodeValue
  return (
    <>
      En voici les raisons :
      <ol>
        {conditions
          .map(([k, v]) => (typeof v === 'string' ? v : null))
          .filter(Boolean)
          .map((dottedNamePart) => {
            const dottedName = 'copropriété . ' + dottedNamePart
            const condition = rules[dottedName]
            const value = evaluate(dottedName)

            return (
              <li key={dottedName}>
                {condition.titre} :{' '}
                <Badge noIcon severity={value ? 'success' : 'error'}>
                  {value ? '✔ oui' : '✗ non'}
                </Badge>
              </li>
            )
          })}
      </ol>
    </>
  )
}
