import Link from 'next/link'
import PaymentTypeBlock from '../PaymentTypeBlock'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'
import { No, Yes } from '../ResultUI'

export default function TaxeFoncière({
  oldIndex,
  choice,
  setSearchParams,
  answeredQuestions,
  engine,
  situation,
  exampleSituation,
  rules,
}) {
  engine.setSituation(exampleSituation)
  console.log(
    'lightyellow montant',
    engine.setSituation(exampleSituation).evaluate('taxe foncière . montant'),
  )
  console.log(
    'lightyellow test',
    engine.setSituation(exampleSituation).evaluate('taxe foncière . taux'),
  )
  console.log('lightyellow s', exampleSituation)

  const communeName = situation['logement . commune . nom'],
    communeEligible = situation['taxe foncière . commune . éligible'] === 'oui',
    taux = situation['taxe foncière . commune . taux']

  const dottedName = 'taxe foncière'
  const rule = rules[dottedName]
  return (
    <AideAmpleur dottedName={'taxe foncière'}>
      <div>
        <p dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }} />
        {communeEligible}
        {communeName != null &&
          (!communeEligible ? (
            <p>
              La commune {communeName} de votre logement{' '}
              <No>n'est pas éligible</No> à l'exonération.
            </p>
          ) : (
            <p>
              La commune {communeName} de votre logement est <Yes>éligible</Yes>
              ,{' '}
              {taux ? (
                <p>pour une exonération de {taux}.</p>
              ) : (
                <p>
                  mais nous ne connaissons pas son taux (50 ou 100 %)
                  d'exonération.
                </p>
              )}
            </p>
          ))}
        <InformationBlock>
          <div
            dangerouslySetInnerHTML={{ __html: rule.informationsUtilesHtml }}
          />
        </InformationBlock>
        <PaymentTypeBlock>
          <p>
            Cette aide est une exonération de taxe locale, une fois par an
            pendant 3 ans.
          </p>
        </PaymentTypeBlock>
        <AideCTA text="Obtenir l'exonération">
          <p>
            Vous devez adresser au service des impôts correspondant au lieu de
            situation du bien, avant le 1 er janvier de la première année au
            titre de laquelle l’exonération est applicable, une déclaration
            comportant tous les éléments d’identification du bien, dont la date
            d’achèvement du logement.
          </p>
          <a href="https://www.impots.gouv.fr/particulier/questions/ai-je-droit-pour-ma-taxe-fonciere-lexoneration-en-faveur-des-economies">
            Plus d'infos sur impots.gouv.fr
          </a>
        </AideCTA>
      </div>
    </AideAmpleur>
  )
}
