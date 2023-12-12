import { Key } from './ExplicationUI'

export default function Explication({ engine, rules, situation }) {
  const upEngine = engine.setSituation(situation)

  const revenuClasse = upEngine.evaluate('revenu . classe'),
    revenuMissing = Object.entries(revenuClasse.missingVariables).map(
      ([k, v]) => rules[k],
    )
  console.log(revenuClasse)

  return (
    <section>
      <h2>Explications</h2>
      <p>
        Vous êtes {revenuMissing.length ? 'temporairement' : ''} considéré comme
        appartenant à la classe de revenu dite{' '}
        <Key $ok={true}>{revenuClasse.nodeValue}</Key>
        {revenuMissing.length ? (
          <span>
            , en attendant les informations suivantes :{' '}
            {revenuMissing.map((el) => (
              <>
                <Key $ok={false}>{el.titre.toLowerCase()}</Key>
                <span> </span>
              </>
            ))}
          </span>
        ) : (
          ''
        )}
        .
      </p>
    </section>
  )
}
