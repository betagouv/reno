import AideAmpleur from './AideAmpleur'
import { No, Yes } from '../ResultUI'
import { Key } from '../explications/ExplicationUI'

export default function TaxeFoncière({
  isEligible,
  setSearchParams,
  answeredQuestions,
  engine,
  situation,
  exampleSituation,
  rules,
  expanded,
}) {
  engine.setSituation(exampleSituation)

  const communeName =
    situation['logement . commune . nom'] || situation['ménage . commune . nom']

  const communeEligible = engine
    .setSituation(situation)
    .evaluate('taxe foncière . commune . éligible')
  const taux = situation['taxe foncière . commune . taux']

  const dottedName = 'taxe foncière'
  const rule = rules[dottedName]
  return (
    <AideAmpleur
      {...{
        isEligible,
        engine,
        dottedName: 'taxe foncière',
        setSearchParams,
        answeredQuestions,
        situation,
        expanded,
      }}
    >
      <p>
        La commune <Key $state={'prime-black'}>{communeName}</Key> de votre
        logement{' '}
        {!communeEligible ? (
          <>
            <No>n'a pas appliqué</No> l'exonération de taxe foncière l'année
            dernière.
          </>
        ) : (
          <>
            <Yes>a appliqué</Yes> l'exonération de taxe foncière au taux de{' '}
            <Key $state={'prime-black'}>{taux}</Key> l'année dernière.
          </>
        )}
      </p>
      {expanded && (
        <>
          <p dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }} />
        </>
      )}
    </AideAmpleur>
  )
}
