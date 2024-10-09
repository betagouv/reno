import AideAmpleur from './AideAmpleur'
import { No, Yes } from '../ResultUI'
import { ExternalLink } from '../UI'
import checkIcon from '@/public/check.svg'

export default function TaxeFoncière({
  setSearchParams,
  answeredQuestions,
  engine,
  situation,
  exampleSituation,
  rules,
  expanded
}) {
  engine.setSituation(exampleSituation)

  const communeName = situation['logement . commune . nom']
  const communeEligible = situation['taxe foncière . commune . éligible . logement'] === 'oui' ? 
      true :
      situation['taxe foncière . commune . éligible . ménage'] === 'oui'
  const taux = situation['taxe foncière . commune . taux']

  const dottedName = 'taxe foncière'
  const rule = rules[dottedName]
  return (
    <AideAmpleur {...{
      engine,
      dottedName: 'taxe foncière',
      setSearchParams,
      answeredQuestions,
      situation,
      expanded
    }}>
      {
        (!communeEligible ? (
          <p>
            La commune {communeName} de votre logement{' '}<No>n'est pas éligible</No> à l'exonération.
          </p>
        ) : (
          <p>
            La commune {communeName} de votre logement est <Yes>éligible</Yes>,{' '}
            {taux ? (
              <>pour une exonération de {taux}.</>
            ) : (
              <>
                mais nous ne connaissons pas son taux (50 ou 100 %) d'exonération.
              </>
            )}
          </p>
        ))}
      { expanded && (
        <>
          <h3>Comment est calculée l'aide ?</h3>
          <p dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }} />
          <h3>Les principales conditions d'éligibilité ?</h3>
          <div
            css={`list-style-image: url(${checkIcon.src}); li { margin: 1rem 0; ul {list-style-image: none;}}`}
            dangerouslySetInnerHTML={{ __html: rule.conditionsEligibilitesHTML }} 
          />
        </>
      )}
    </AideAmpleur>
  )
}
