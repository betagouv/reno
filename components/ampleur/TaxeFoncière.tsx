import AideAmpleur from './AideAmpleur'
import { No, Yes } from '../ResultUI'
import { Key } from '../explications/ExplicationUI'
import ConditionsWarning from './ConditionsWarning'

export default function TaxeFoncière({
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
        engine,
        dottedName: 'taxe foncière',
        setSearchParams,
        answeredQuestions,
        situation,
        expanded,
      }}
    >
      {communeEligible.nodeValue && (
        <p>
          La commune <Key $state={'prime-black'}>{communeName}</Key> de votre
          logement{' '}
          <>
            <Yes>a appliqué</Yes> l'exonération de taxe foncière au taux de{' '}
            <Key $state={'prime-black'}>{taux}</Key> l'année dernière.
          </>
        </p>
      )}
      {expanded && (
        <>
          <ConditionsWarning
            {...{
              engine,
              dottedName,
              setSearchParams,
              situation,
              answeredQuestions,
            }}
          />
          <p dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }} />
        </>
      )}
    </AideAmpleur>
  )
}
