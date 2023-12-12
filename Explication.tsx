import { Key, P } from './ExplicationUI'

export default function Explication({ engine, rules, situation }) {
  const upEngine = engine.setSituation(situation)

  const revenuClasse = upEngine.evaluate('revenu . classe'),
    revenuMissing = Object.entries(revenuClasse.missingVariables).map(
      ([k, v]) => rules[k],
    ),
    hasRevenuMissing = revenuMissing.length > 0
  console.log(revenuClasse)

  const idf = upEngine.evaluate('région . IdF').nodeValue

  const sauts = upEngine.evaluate('sauts'),
    sautsMissing = sauts.missingVariables,
    hasSautsMissing = Object.entries(sautsMissing).length > 0,
    dpeFrom = upEngine.evaluate('DPE . actuel'),
    dpeTo = upEngine.evaluate('DPE . visé')

  return (
    <section>
      <h2>Explications</h2>
      <P>
        Vous êtes {hasRevenuMissing ? <em>temporairement</em> : ''} considéré
        comme appartenant à la classe de revenu dite{' '}
        <Key $state={hasRevenuMissing ? 'inProgress' : 'final'}>
          {revenuClasse.nodeValue}
        </Key>
        {idf ? <span>(barème Île-de-France)</span> : ''}
        {revenuMissing.length ? (
          <span>
            , en attendant les informations suivantes :{' '}
            {revenuMissing.map((el) => (
              <>
                <Key $state={'null'}>{el.titre.toLowerCase()}</Key>
                <span> </span>
              </>
            ))}
          </span>
        ) : (
          ''
        )}
        .
      </P>
      {!hasSautsMissing && (
        <P>
          Votre projet prévoit <Key $state="final">{sauts.nodeValue}</Key> sauts
          de classe DPE (de {dpeFrom.nodeValue} à {dpeTo.nodeValue}
          ).
        </P>
      )}
    </section>
  )
}
