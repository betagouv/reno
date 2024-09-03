import { formatValue } from '@/node_modules/publicodes/dist/index'
import Image from 'next/image'
import Link from 'next/link'
import AidesLocales from './AidesLocales'
import crossIcon from '@/public/remix-close-empty.svg'
import { ProfessionnelLabel } from './AmpleurSummary'
import { CTA, CTAWrapper, Card, PrimeStyle } from './UI'
import { InapplicableBlock } from './explications/Éligibilité'

const dottedName = 'MPR . accompagnée . montant'
export default function SimplifiedAmpleurSummary({ engine, url, situation }) {
  const evaluation = engine
    .setSituation({ ...situation, 'projet . travaux': 999999 })
    .evaluate(dottedName)

  const value = formatValue(evaluation, { precision: 0 })

  const mpraEligible = engine.evaluate('MPR . accompagnée . éligible')

  const eligible = mpraEligible.nodeValue == true && evaluation.nodeValue > 0

  return (
    <section>
      <header>
        <h3>Faire un rénovation d'ampleur</h3>
        <ProfessionnelLabel />
        <p
          css={`
            margin-top: 1.4rem;
          `}
        >
          Un programme sur-mesure pour gagner au minimum{' '}
          deux&nbsp;classes&nbsp;DPE.
        </p>
      </header>
      <Card
        css={`
          margin-top: 0.2rem;
          max-width: 40rem;
        `}
      >
        {!eligible ? (
          <div
            css={`
              margin-bottom: -2rem;
            `}
          >
            <InapplicableBlock>
              <Image src={crossIcon} alt="Icône d'une croix" />
              <div>
                <p>
                  Vous n'êtes pas éligible à MaPrimeRénov' parcours accompagné.
                </p>
                <small>
                  Il faut être propriétaire du logement, construit il y a au
                  moins 15 ans et occupé ou loué comme résidence principale.
                </small>
              </div>
            </InapplicableBlock>
          </div>
        ) : (
          <section>
            <p>MaPrimeRénov' parcours accompagné</p>
            <PrimeStyle $inactive={!eligible}>
              {!eligible ? `` : `Jusqu'à `} <strong>{value}</strong>
            </PrimeStyle>
          </section>
        )}

        {/* On suppose pour l'instant que toutes les aides locales sont pour des rénovations d'ampleur, mais ce ne sera pas le cas ! */}
        <AidesLocales {...{ engine, situation }} />
        <div
          css={`
            visibility: ${eligible && url ? 'visible' : 'hidden'};
            > div {
              margin-bottom: 0.3rem;
              margin-top: 1rem;
            }
          `}
        >
          <CTAWrapper $justify="end">
            <CTA $fontSize="normal">
              <Link href={url}>Découvrir le détail</Link>
            </CTA>
          </CTAWrapper>
        </div>
      </Card>
    </section>
  )
}
