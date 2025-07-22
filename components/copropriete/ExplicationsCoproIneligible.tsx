import rules from '@/app/règles/rules'
import styled from 'styled-components'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
const rule = rules['copropriété . condition éligibilité']
const conditions = Object.entries(rule['toutes ces conditions'])
console.log('cyan é', rule)
export default function ExplicationsCoproIneligible({ engine, situation }) {
  const evaluate = (dottedName) =>
    engine.setSituation(situation).evaluate(dottedName).nodeValue
  return (
    <Section>
      <small>En voici les raisons : </small>
      <Ol>
        {conditions
          .map(([k, v]) => (typeof v === 'string' ? v : null))
          .filter(Boolean)
          .map((dottedNamePart) => {
            const dottedName = 'copropriété . ' + dottedNamePart
            const condition = rules[dottedName]
            const value = evaluate(dottedName)
            console.log('cyan é', value, condition)
            return (
              <li key={dottedName}>
                {condition.titre} :{' '}
                <Badge noIcon severity={value ? 'success' : 'error'}>
                  {value ? '✔ oui' : '✗ non'}
                </Badge>
              </li>
            )
          })}
      </Ol>
    </Section>
  )
}

const Ol = styled.ol`
  list-style-type: disc;
  margin: 1rem 0;
  margin-left: 0;
  li  {
    margin: 0.6rem 0;
  }
`

const Section = styled.section`
  small {
    font-size: 90%;
    color: gray;
  }
`
