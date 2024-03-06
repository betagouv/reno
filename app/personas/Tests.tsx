import { Section } from '@/components/UI'
import rawTests from '@/app/règles/tests.csv'
import { GreenCell, Table } from './TestsUI'
import rules from '@/app/règles/rules'
import Publicodes from 'publicodes'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import Link from 'next/link'
import useSetSearchParams from '@/components/useSetSearchParams'
import { encodeSituation } from '@/components/publicodes/situationUtils'

const tests = rawTests.filter((test) => test['aide complémentaire'] === 0)

const engine = new Publicodes(rules)

export default function Tests() {
  return (
    <Section>
      <h2>Tests</h2>
      <p>
        Pour assurer la fiabilité de notre modèle de calcul, voici une liste de
        tests effectués via un modèle tiers.
      </p>
      <Table>
        <thead>
          <tr>
            <th scope="col">Classe de revenu</th>
            <th scope="col">Sauts DPE</th>
            <th scope="col">Travaux HT</th>
            <th scope="col">Aide MPR-A test</th>
            <th scope="col">Aide MPR-A recalculée</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => {
            const situation = {
              travaux: test['montant de travaux HT'],
              'travaux . TTC': test['montant de travaux TTC'],
              investissement: 9999999, //TODO dirty, this happens because "plafond" still applies to a rule for which we set a value
              sauts: test['saut de classe'],
              'MPR . accompagnée . bonus . condition':
                test['bonus passoire'] === '0,1' ? 'oui' : 'non',
              'ménage . revenu . classe': `"${
                {
                  TMO: 'très modeste',
                  MO: 'modeste',
                  INT: 'intermédiaire',
                  SUP: 'supérieure',
                }[test['ressource ménage']]
              }"`,
            }
            console.log(situation)
            const evaluation = engine
              .setSituation(situation)
              .evaluate('MPR . accompagnée')

            const value = formatValue(evaluation)

            const expectedValue = test['aide MPR']

            const valid =
              Math.round(evaluation.nodeValue) ===
              Math.round(
                typeof expectedValue === 'string'
                  ? expectedValue.replace(',', '.')
                  : expectedValue,
              )
            return (
              <tr key={JSON.stringify(test)}>
                <td>{test['ressource ménage']}</td>
                <td>{test['saut de classe']}</td>
                <td>{test['montant de travaux HT']} €</td>
                <td>{expectedValue} €</td>

                {valid ? <GreenCell>{value}</GreenCell> : <td>{value}</td>}
                <td>
                  <Link
                    href={
                      '/documentation/MPR/accompagnée/?' +
                      new URLSearchParams(encodeSituation(situation)).toString()
                    }
                  >
                    Inspection
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </Section>
  )
}
