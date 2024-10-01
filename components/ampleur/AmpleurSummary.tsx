import { Labels } from '@/app/LandingUI'
import addIcon from '@/public/add-circle-stroke.svg'
import removeIcon from '@/public/remove-circle-stroke.svg'
import Image from 'next/image'
import Link from 'next/link'
import { formatValue } from 'publicodes'
import { AideSummary } from './AideSummary'
import { CTA, CTAWrapper, Card, PrimeStyle } from '@/components/UI'
import { roundToThousands, sortBy } from '@/components/utils'
import { useAides } from './useAides'

export const computeAideStatus = (evaluation) => {
  const value = formatValue(evaluation, { precision: 0 })

  if (value === 'Non applicable' || value === 'non') return false
  if (value === 'Pas encore défini' || evaluation.nodeValue === 0) return null
  if (evaluation.nodeValue > 0) return true
  const message = 'Unknown aide status, missing a case in the switch'
  console.error(message, evaluation.dottedName, value, evaluation)
  throw new Error(message)
}

export const createExampleSituation = (engine, situation, extreme = false) => {
  const exampleSituation = {
    'projet . travaux': extreme
      ? 999999
      : roundToThousands(
          engine.evaluate('projet . enveloppe estimée').nodeValue,
          5,
        ),
    'vous . propriétaire': 'oui',
    'taxe foncière . condition de dépenses': 'oui',
    ...situation,
  }
  return exampleSituation
}

export const getNeSaisPasEtNonEligibles = (aides) =>
  sortBy((aide) => (aide.status === null ? 1 : 2))(
    aides.filter((aide) => aide.status !== true),
  )

export default function AmpleurSummary({
  engine,
  url,
  situation,
  expanded,
  setSearchParams,
}) {
  const extremeSituation = createExampleSituation(engine, situation, true)

  const evaluation = engine
    .setSituation(extremeSituation)
    .evaluate('ampleur . montant')

  console.log(
    'purple test',
    engine.evaluate('conditions communes'),
    engine.evaluate('logement . au moins 15 ans'),
  )
  const value = formatValue(evaluation, { precision: 0 })

  const aides = useAides(engine, extremeSituation)

  const expand = () =>
    setSearchParams({ details: expanded ? undefined : 'oui' })

  const neSaisPasEtNonEligibles = getNeSaisPasEtNonEligibles(aides)

  return (
    <section>
      <header>
        <h3>Faire une rénovation d'ampleur</h3>
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
          /* if nothing's active, grayscale the font ?
		  */
          margin-top: 0.2rem;
          background: white;
          padding-top: 1.2rem;
          max-width: 40rem;
        `}
      >
        {aides
          .filter((aide) => {
            if (aide.status !== true) return false
            const isChild = aide['aide parente']
            if (!isChild) return true
            if (expanded) return true
            return false
          })
          .map((aide) => {
            const text = aide.marque,
              text2 = aide['complément de marque']

            return (
              <AideSummary
                key={aide.dottedName}
                {...{
                  ...aide,
                  icon: aide.icône,
                  text,
                  text2,
                  type: aide.type,
                  expanded,
                  engine,
                }}
              />
            )
          })}

        <div
          css={`
            margin-top: ${expanded ? '3rem' : '1.6rem'};
            display: flex;
            align-items: center;
            justify-content: end;
            span {
              margin: 0 0.15rem;
            }
            strong {
              font-weight: normal;
              text-decoration: underline;
              text-decoration-color: var(--color);
            }
          `}
        >
          <span>
            {expanded ? (
              <span>
                <strong>Au total</strong> jusqu'à
              </span>
            ) : (
              <span>Des aides jusqu'à</span>
            )}
          </span>
          <PrimeStyle
            css={`
              font-size: 110%;
            `}
          >
            {value}
          </PrimeStyle>
        </div>

        <button
          css={`
            border: none;
            background: none;
            text-align: right;
            display: block;
            margin: 0.5rem 0 0 auto;
            color: gray;
            img {
              width: 0.7rem;
              height: auto;
            }
          `}
        >
          <small onClick={() => expand()}>
            {expanded ? (
              <span>
                <Image src={removeIcon} alt="Icône signe moins entouré" />{' '}
                Cacher
              </span>
            ) : (
              <span>
                <Image src={addIcon} alt="Icône signe plus entouré" /> Voir
              </span>
            )}{' '}
            les montants aide par aide
          </small>
        </button>

        <div
          css={`
            visibility: visible;
            & > div {
              margin-bottom: 0.3rem;
              margin-top: 1rem;
            }
          `}
        >
          <CTAWrapper $justify="end">
            <CTA $fontSize="normal">
              <Link href={url}>Choisir ce parcours</Link>
            </CTA>
          </CTAWrapper>
        </div>
        {neSaisPasEtNonEligibles.length > 0 && (
          <div>
            {neSaisPasEtNonEligibles.map((aide) => {
              const text = aide.marque,
                text2 = aide['complément de marque']
              return (
                <AideSummary
                  key={aide.dottedName}
                  {...{
                    ...aide,
                    icon: aide.icône,
                    text,
                    text2,
                    type: aide.type,
                    expanded,
                    small: true,
                  }}
                />
              )
            })}
          </div>
        )}
      </Card>
    </section>
  )
}
export const ProfessionnelLabel = () => (
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
)
