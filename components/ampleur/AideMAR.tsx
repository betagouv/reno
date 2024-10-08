import PaymentTypeBlock from '../PaymentTypeBlock'
import { CTA, CTAWrapper, Card, ExternalLink } from '../UI'
import Value from '../Value'
import AideAmpleur, { AideCTA } from './AideAmpleur'
import checkIcon from '@/public/check.svg'

export default function AideMAR({
  engine,
  situation,
  dottedName,
  setSearchParams,
  answeredQuestions,
  rules,
  expanded
}) {
  
  const rule = rules[dottedName]
  return (
    <AideAmpleur {...{
      dottedName, 
      setSearchParams,
      situation,
      answeredQuestions,
      level: 2,
      expanded
    }}>
      { false && <p dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }} /> }
      <p>L'audit énergétique permet de connaître les performances d'un bien immobilier, et de définir les scénarios de travaux pour atteindre les performance visé.</p> 
      <p>Il est obligatoire pour bénéficier de Ma Prime Rénov', parcours accompagné.</p>
      { !expanded && (
        <Card $background="#f7f8f8">
          <div
            css={`
              display: flex;
              align-items: center;
              margin-top: 1rem;
            `}
          >
            {/* <Image
              src={calculatorIcon}
              alt="Icône calculette"
              css={`
                width: 3rem !important;
                height: auto !important;
                margin-right: 0.8rem !important;
              `}
            /> */}
            <p>
              En tant que ménage{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: 'ménage . revenu . classe',
                  state: 'prime-black',
                }}
              />
              , vous bénéficiez d'une aide de{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: dottedName,
                  state: 'prime-black',
                }}
              />{' '}
              pour l'accompagnement MaPrimeRénov'.
            </p>
          </div>
        </Card>
      )}
      { expanded && (
          <>
            <h3>Comment est calculée l'aide?</h3>
            <p>
              En tant que ménage{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: 'ménage . revenu . classe',
                  state: 'prime-black',
                }}
              />
              , vous bénéficiez d'une aide de{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: dottedName,
                  state: 'prime-black',
                }}
              />{' '}
              pour l'accompagnement MaPrimeRénov'.
            </p>
            <h3>Les principales conditions d'éligibilité ?</h3>
            <ul css={`list-style-image: url(${checkIcon.src}); li { margin: 1rem 0;}`}>
              <li>L'audit doit être réalisé par un auditeur certifié. Il peut être réalisé par votre Accompagnateur Rénov'</li>
              <li>Pour bénéficier de MaPrimeRénov' pour une rénovation d'ampleur, vous devez obligatoirement suivre l'un des scénarios de travaux proposés suite à l'audit</li>
            </ul>
            <h3>Comment toucher cette aide</h3>
            <p>
              Contactez votre conseiller France Rénov’. 
              Il vous fournira des conseils selon votre situation et vous orientera vers Mon Accompagnateur Rénov’.
            </p>
            <h3>Pour aller plus loin</h3>
            <p>
              Retrouvez plus d'info sur <ExternalLink 
                href="https://www.economie.gouv.fr/particuliers/maprimerenov-parcours-accompagne-tout-savoir-sur-cette-aide"
                target="_blank"
              >
                  ce lien
              </ExternalLink>
            </p>
            { false && (
              <>
                <PaymentTypeBlock>
                  <p>
                    Nous ne savons pas s'il sagit d'une avance ou d'un remboursement
                    après paiement de l'Accompagnateur Rénov'.
                  </p>
                </PaymentTypeBlock>
                <AideCTA text="Trouver mon Accompagnateur">
                  <p>
                    Vous pourrez notamment consulter l'annuaire des Accompagnateurs
                    Rénov'.
                  </p>
                  <CTAWrapper $justify="left">
                    <CTA>
                      <a href="https://france-renov.gouv.fr/preparer-projet/faire-accompagner/mon-accompagnateur-renov">
                        Documentation France-Rénov
                      </a>
                    </CTA>
                  </CTAWrapper>
                </AideCTA>
              </>
            )}
          </>
        )}
    </AideAmpleur>
  )
}
