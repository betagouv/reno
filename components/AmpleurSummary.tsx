import { Labels } from '@/app/LandingUI'
import Link from 'next/link'
import { formatValue } from 'publicodes'
import { SummaryAide } from './SummaryAide'
import { CTA, CTAWrapper, Card } from './UI'

import aidesAmpleur from '@/app/règles/ampleur.yaml'

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

  const aides = aidesAmpleur.map((aide) => {
    const evaluation = engine
      .setSituation({ ...situation, ...aide.situation })
      .evaluate(aide.règle)
    const value = formatValue(evaluation, { precision: 0 })

    const eligible = !(
      value === 'Non applicable' ||
      evaluation.nodeValue === 0 ||
      value === 'non'
    )
    return { ...aide, evaluation, value, eligible }
  })

  return (
    <section>
      <header>
        <h3>Faire une rénovation d'ampleur</h3>
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
          max-width: 32rem;
        `}
      >
        {aides.map((aide) => (
          <SummaryAide
            key={aide.règle}
            {...{
              ...aide,
              icon: aide.icône,
              text: aide.texte,
              text2: aide.texte2,
              type: aide.type,
            }}
          />
        ))}

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
