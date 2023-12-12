import { Key } from './ExplicationUI'

export default function Explication({ engine, rules, situation }) {
  const upEngine = engine.setSituation(situation)

  const revenuClasse = upEngine.evaluate('revenu . classe').nodeValue

  return (
    <section>
      <h2>Explications</h2>
      <p>
        Vous êtes considéré comme appartenant à la classe de revenu dite{' '}
        <Key>{revenuClasse}</Key>.
      </p>
    </section>
  )
}
