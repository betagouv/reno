import { compute } from '../explications/Aide'
import { Key, P } from './ExplicationUI'

export function Écrêtement({ engine, rules, situation }) {
  const upEngine = engine.setSituation(situation)

  const écrêtement = compute("ampleur . pourcent d'écrêtement", upEngine, rules)
  const isÉcrêté = compute('ampleur . est écrêté', upEngine, rules)

  return (
    <section>
      <P>
        {isÉcrêté.value === 'oui' ? (
          <span>
            Finalement, un écrêtement vient limiter le taux de votre aide à un
            maximum de <Key>{écrêtement.value}</Key> de vos travaux TTC.
          </span>
        ) : (
          ''
        )}
      </P>
    </section>
  )
}
