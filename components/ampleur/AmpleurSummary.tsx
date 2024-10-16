import { Labels } from '@/app/LandingUI'
import checkIcon from '@/public/check.svg'
import Link from 'next/link'
import { formatValue } from 'publicodes'
import { CTA, CTAWrapper, Card, PrimeStyle } from '@/components/UI'
import { roundToThousands, sortBy } from '@/components/utils'
import { useAides } from './useAides'
import { AideSummary } from './AideSummary'

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
    'projet . travaux': roundToThousands(
      engine.evaluate('projet . enveloppe estimée').nodeValue,
      5,
    ),
    ...situation,
    ...(extreme
      ? {
          'projet . travaux': 999999,
          'projet . DPE visé': 1,
        }
      : {}),
    'taxe foncière . condition de dépenses': 'oui',
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

  const value = formatValue(evaluation, { precision: 0 })

  const aides = useAides(engine, extremeSituation)

  const expand = () =>
    setSearchParams({ details: expanded ? undefined : 'oui' })

  const neSaisPasEtNonEligibles = getNeSaisPasEtNonEligibles(aides)

  return (
    <Card
      css={`
        /* if nothing's active, grayscale the font ?
    */
        background: white;
        margin: 0;
      `}
    >
      <div
        css={`
          display: flex;
          justify-content: space-between;
        `}
      >
        <ProfessionnelLabel />
      </div>
      <h3
        css={`
          font-size: 120%;
        `}
      >
        Rénovation performante
      </h3>
      <p>
        La garantie d'un gain en performance, en confort et d'une réduction de
        vos factures d'énergie
      </p>

      <CTAWrapper $justify="center">
        <CTA
          $fontSize="normal"
          css={`
            width: 100%;
            text-align: center;
          `}
        >
          <Link href={url}>Voir le parcours en détails</Link>
        </CTA>
      </CTAWrapper>

      <p
        css={`
          margin-top: 1rem;
        `}
      >
        Pourquoi choisir ce parcours ?
      </p>
      <ul
        css={`
          li {
            list-style-image: url(${checkIcon.src});
            margin: 0.5rem 0;
          }
        `}
      >
        <li>La garantie d'un gain de performance important</li>
        <li>Des aides souvent plus avantageuses</li>
      </ul>
      <p
        css={`
          margin-top: 1rem;
        `}
      >
        Parmi les aides ?
      </p>
      {aides
        .filter((aide) => {
          if (aide.status !== true) return false
          return ![
            'ampleur . prime individuelle copropriété',
            'MPR . accompagnée . prise en charge MAR',
          ].includes(aide.baseDottedName)
        })
        .slice(0, 3)
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
                expanded: true,
                display: 'ampleur-card',
                engine,
              }}
            />
          )
        })}
      {/* {neSaisPasEtNonEligibles.length > 0 && (
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
      )} */}
    </Card>
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
    {['⭐ Parcours ampleur'].map((text) => (
      <li key={text}>{text}</li>
    ))}
  </Labels>
)
