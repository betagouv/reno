import { Labels } from '@/app/LandingUI'
import Link from 'next/link'
import { formatValue } from 'publicodes'
import { SummaryAide } from './SummaryAide'
import { CTA, CTAWrapper, Card } from './UI'

import aidesAmpleur from '@/app/règles/ampleur.yaml'
import { PrimeStyle } from './Geste'

export default function AmpleurSummary({
  engine,
  url,
  situation,
  expanded,
  setSearchParams,
}) {
  const evaluation = engine
    .setSituation({ ...situation, 'projet . travaux': 999999 })
    .evaluate('ampleur . montant')

  const value = formatValue(evaluation, { precision: 0 })

  const eligible = !(
    value === 'Non applicable' ||
    evaluation.nodeValue === 0 ||
    value === 'non'
  )

  const aides = aidesAmpleur.liste.map((aide) => {
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

  const expand = () =>
    setSearchParams({ details: expanded ? undefined : 'oui' })

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
              expanded,
            }}
          />
        ))}

        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: end;
            span {
              margin: 0 0.15rem;
            }
          `}
        >
          <span>
            {expanded ? (
              <span>
                <strong>Au total</strong> jusqu'à
              </span>
            ) : (
              <span>Jusqu'à</span>
            )}
          </span>
          <PrimeStyle>{value}</PrimeStyle>
        </div>
        <button
          css={`
            border: none;
            background: none;
            text-align: right;
            display: block;
            margin: 0 0 0 auto;
            color: gray;
          `}
        >
          <small onClick={() => expand()}>
            {expanded ? 'Cacher' : 'Voir'} les montants aide par aide
          </small>
        </button>
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
