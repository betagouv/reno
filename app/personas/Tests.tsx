import { Section } from '@/components/UI'
import rawTests from '@/app/règles/tests.csv'
import { GreenCell, Table } from './TestsUI'
import rules from '@/app/règles/rules'
import Publicodes from 'publicodes'
import { formatValue } from '@/node_modules/publicodes/dist/index'

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
            const evaluation = engine
              .setSituation({
                travaux: test['montant de travaux HT'],
                sauts: test['saut de classe'],
                'ménage . revenu . classe': `"${
                  {
                    TMO: 'très modeste',
                    MO: 'modeste',
                    INT: 'intermédiaire',
                    SUP: 'supérieure',
                  }[test['ressource ménage']]
                }"`,
              })
              .evaluate('MPR . accompagnée')

            const value = formatValue(evaluation)

            const expectedValue = test['aide MPR']
            const valid =
              Math.round(evaluation.nodeValue) === Math.round(+expectedValue)
            return (
              <tr key={JSON.stringify(test)}>
                <td>{test['ressource ménage']}</td>
                <td>{test['saut de classe']}</td>
                <td>{test['montant de travaux HT']} €</td>
                <td>{expectedValue} €</td>
                {valid ? <GreenCell>{value}</GreenCell> : <td>{value}</td>}
              </tr>
            )
          })}
        </tbody>
      </Table>
    </Section>
  )
}
