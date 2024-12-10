import { Card } from '../UI'
import AideAmpleur from './AideAmpleur'
import rules from '@/app/règles/rules'
import checkIcon from '@/public/check.svg'
import Value from '../Value'
// Note : Nous ignorons pour l'instant le PAR "pas plus", qui ne garantit pas un taux zéro, et qui n'est donc pas à propremement parler une aide de l'État.

export default function PAR({
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  expanded,
}) {
  const dottedName = 'PAR'
  const rule = rules[dottedName]
  return (
    <AideAmpleur
      {...{
        engine,
        dottedName: 'PAR',
        setSearchParams,
        answeredQuestions,
        situation,
        expanded,
      }}
    >
      {expanded && (
        <>
          <p>
            Pendant les 10 premières années du prêt, l'État prend en charge
            l'intégralité des intérêts. À l'expiration de cette période, des
            intérêts au taux fixé librement par l'établissement prêteur au
            moment de la signature du contrat de prêt seront appliqués.
          </p>
          <p>
            L'établissement prêteur peut décider de verser le prêt en une ou
            plusieurs fois sur la base du descriptif et des devis détaillés des
            travaux à réaliser, ou bien à la fin des travaux.
          </p>
          <h3>Comment est calculée l'aide ?</h3>
          <Card $background="#f7f8f8">
            <div
              css={`
                display: flex;
                align-items: center;
              `}
            >
              <section>
                En tant que ménage{' '}
                <Value
                  {...{
                    engine,
                    situation,
                    dottedName: 'ménage . revenu . classe',
                    state: 'prime-black',
                  }}
                />{' '}
                , vous êtes éligible à un prêt d'un montant maximum de 50 000 €
                sans intérêt pendant 10 ans.
              </section>
            </div>
          </Card>
          <h3>Les principales conditions d'éligibilité ?</h3>
          <div
            css={`
              list-style-image: url(${checkIcon.src});
              li {
                margin: 1rem 0;
                ul {
                  list-style-image: none;
                }
              }
            `}
            dangerouslySetInnerHTML={{
              __html: rules[dottedName].conditionsEligibilitesHTML,
            }}
          />
        </>
      )}
    </AideAmpleur>
  )
}
