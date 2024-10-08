import PaymentTypeBlock from '../PaymentTypeBlock'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'
import { No, Yes } from '../ResultUI'
import { ExternalLink } from '../UI'

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

  const communeName = situation['logement . commune . nom'],
    communeEligible = situation['taxe foncière . commune . éligible'] === 'oui',
    taux = situation['taxe foncière . commune . taux']

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
      <p>Certaines collectivités (communes, départements…) exonèrent temporairement de taxe foncière les foyers qui réalisent des travaux d'économie d'énergie. </p>
      { expanded && (
        <>
          <h3>Comment est calculée l'aide?</h3>
          <p>L'exonération peut être totale ou partielle (50% du montant de la taxe foncière), pour une durée de 3 ans ou plus.</p>
          <h3>Les principales conditions d'éligibilité ?</h3>
          <p>Il existe des conditions d'éligibilité en fonction de l'année d'achèvement de votre logement (avant le 1er janvier 1989, ou après le 1er janvier 2009).</p>
          <h3>Comment toucher cette aide</h3>
          <p>Cette exonération peut être demandée par le propriétaire auprès du service des impôts du lieu de situation du logement.</p>
          <h3>Pour aller plus loin</h3>
          <p>
            Retrouvez plus d'info sur <ExternalLink 
              href="https://www.impots.gouv.fr/particulier/questions/ai-je-droit-pour-ma-taxe-fonciere-lexoneration-en-faveur-des-economies"
              target="_blank"
            >
              ce lien
            </ExternalLink>
          </p>
          { false && (
            <>
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
            </>
          )} 
        </>
      )}
    </AideAmpleur>
  )
}
