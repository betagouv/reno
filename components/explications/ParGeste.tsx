import { compute } from './Aide'
import { Key, P } from './ExplicationUI'
import Value from './Value'

export default function ParGeste({ rules, engine }) {
  const classe = compute('revenu . classe', engine, rules)
  const passoire = compute('DPE . actuel . passoire', engine, rules)
  return (
    <section>
      <h4>Ma Prime Rénov' par geste</h4>
      <P>
        Vous{' '}
        <Value
          name={'MPR . non accompagnée . conditions'}
          engine={engine}
          display={(value) => (value ? 'êtes' : "n'êtes pas")}
        />{' '}
        éligible à la prime par geste, car :
        <ul>
          <li>
            {' '}
            {classe.revenu === 'supérieure' ? '❌' : '✅'} votre revenu est{' '}
            <Value evaluation={classe} engine={engine} />
          </li>
          <li>
            {passoire.value === 'oui' ? '❌' : '✅'} votre logement{' '}
            <Value
              evaluation={passoire}
              engine={engine}
              display={(v) =>
                v
                  ? 'est une passoire thermique'
                  : "n'est pas une passoire thermique"
              }
            />
          </li>
        </ul>
        .
      </P>
    </section>
  )
}
