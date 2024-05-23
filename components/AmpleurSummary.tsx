import { Labels } from '@/app/LandingUI'
import Link from 'next/link'
import { formatValue } from 'publicodes'
import AidesLocales from './AidesLocales'
import { PrimeStyle } from './Geste'
import { SummaryAide } from './SummaryAide'
import { CTA, CTAWrapper, Card } from './UI'
import { ExplicationMPRA } from './explications/Éligibilité'

export default function AmpleurSummary({ engine, url, situation }) {
  const mpra = engine
    .setSituation({ ...situation, 'projet . travaux': 999999 })
    .evaluate('MPR . accompagnée . montant')
  const mpraValue = formatValue(mpra, { precision: 0 })

  const hasMpra = !(
    mpraValue === 'Non applicable' ||
    mpra.nodeValue === 0 ||
    mpraValue === 'non'
  )

  return (
    <section>
      <header>
        <h3>Faire un rénovation d'ampleur</h3>
        <Labels
          $color={'#6E4444'}
          $background={'#fdf8db'}
          css={`
            margin-top: 0.3rem;
          `}
        >
          {['🤝 Un professionnel vous accompagne'].map((text) => (
            <li key={text}>{text}</li>
          ))}
        </Labels>
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
          /* if nothing's active, grayscale the font ?
		  */
          margin-top: 0.2rem;
          background: white;
          padding-top: 1.2rem;
        `}
      >
        <SummaryAide
          {...{
            engine,
            icon: 'maprimerenov.svg',
            text: "MaPrimeRénov'",
            text2: 'accompagnée',
            dottedName: 'MPR . accompagnée . montant',
            situation: { ...situation, 'projet . travaux': 999999 },
          }}
        />

        {/* On suppose pour l'instant que toutes les aides locales sont pour des rénovations d'ampleur, mais ce ne sera pas le cas ! */}
        <SummaryAide
          {...{
            icon: 'hexagone-contour.svg',
            text: 'Aide locale',
            text2: 'Angers Métropole',
            engine,
            dottedName: 'aides locales',
            situation: { ...situation, 'projet . travaux': 999999 },
          }}
        />

        <SummaryAide
          {...{
            icon: 'cee.svg',
            text: 'CEE',
            text2: "Rénovation d'ampleur",
            engine,
            dottedName: "CEE . rénovation d'ampleur . montant",
            situation: { ...situation },
          }}
        />

        <div
          css={`
            visibility: visible > div {
              margin-bottom: 0.3rem;
              margin-top: 1rem;
            }
          `}
        >
          <CTAWrapper $justify="start">
            <CTA $fontSize="normal">
              <Link href={url}>Découvrir le détail</Link>
            </CTA>
          </CTAWrapper>
        </div>
      </Card>
    </section>
  )
}
