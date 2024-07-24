import { Labels } from '@/app/LandingUI'
import css from '@/components/css/convertToJs'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import Link from 'next/link'
import { PrimeStyle } from './Geste'
import { CTA, CTAWrapper, Card, cardBorder } from './UI'
import { ExplicationMPRA, ExplicationMPRG } from './explications/Éligibilité'
import GestesPreview from './mprg/GestesPreview'
import AidesLocales from './AidesLocales'
import rules from '@/app/règles/rules'
import { ProfessionnelLabel } from './AmpleurSummary'

/* This component was first written for simulation mode where the state could be success, running or fail. Since then we've switched to a more classic result where it
 * can only be success or fail. I've kept this object for future references, for its colors */
export const colors = {
  success: {
    background: '#297254',
    lightBackground: '#c4fad5', //TODO use this for the contour, more beautiful
    label: 'Estimation finale',
  },
  running: {
    background: 'var(--color)',
    color: 'white',
    label: 'Sous conditions',
  },
  fail: {
    background: 'salmon',
    lightBackground: '#f6b7af',
    color: 'white',
    label: 'Non éligible',
  },
  //  waiting: { background: '#9f9f9f', color: 'white', label: 'À suivre' },
}

const dottedName = 'MPR . accompagnée . montant'
export default function SimplifiedAmpleurSummary({
  engine,
  url,
  situation,
  expanded,
  setSearchParams,
}) {
  const rule = rules[dottedName]
  const evaluation = engine
    .setSituation({ ...situation, 'projet . travaux': 999999 })
    .evaluate(dottedName)
  console.log('result', evaluation)

  const value = formatValue(evaluation, { precision: 0 })

  const eligible = !(
    value === 'Non applicable' ||
    evaluation.nodeValue === 0 ||
    value === 'non'
  )

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
          color: ${!eligible ? '#888' : 'inherit'};
          margin-top: 0.2rem;
          background: white;
          max-width: 40rem;
        `}
      >
        <h4
          style={css`
            font-weight: 400;
            margin: 1rem 0 0rem;
            font-size: 120%;
          `}
          dangerouslySetInnerHTML={{ __html: rule.titreHtml }}
        />

        {!eligible ? (
          <div
            css={`
              margin: 1rem 0;
              color: black;
              text-align: center;
            `}
          >
            <ExplicationMPRA {...{ engine, situation }} />
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
