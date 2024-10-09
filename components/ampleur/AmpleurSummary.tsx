import { Labels } from '@/app/LandingUI'
import Image from 'next/image'
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
        }
      : {}),
    'vous . propriétaire . condition': 'oui',
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
    <section>
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
        <div css={`
          display: flex; 
          justify-content: space-between;
        `}>
          <ProfessionnelLabel />
          <PrimeStyle
              css={`
                font-size: 110%;
              `}
            >
              {value}
          </PrimeStyle>
        </div>
        <h3>Pour une rénovation performante</h3>
        <p>La garantie d'un gain en performance, en confort et d'une réduction de vos factures d'énergie</p>

        <CTAWrapper $justify="center">
          <CTA $fontSize="normal">
            <Link href={url}>Le parcours ampleur en détails</Link>
          </CTA>
        </CTAWrapper>

        <p css={`margin-top: 1rem;`}><em>Pourquoi choisir ce parcours ?</em></p>
        <ul css={`
          list-style-type: none;
          padding: 0;
          li {
            display: flex;
            align-items: center;
            margin: 0.5rem 0;
            img {
              margin-right: 0.5rem;
            }
          }
        `}>
          <li>
            <Image src={checkIcon} alt="icone check" />
            La garantie d'un gain de performance important  
          </li>
          <li>
            <Image src={checkIcon} alt="icone check" />
            Des aides souvent plus avantageuses
          </li>
        </ul>
        <p css={`margin-top: 1rem;`}><em>Parmi les aides ?</em></p>
        {aides
          .filter((aide) => {
            if (aide.status !== true) return false
            return !['ampleur . prime individuelle copropriété', 'MPR . accompagnée . prise en charge MAR'].includes(aide.baseDottedName)
          })
          .slice(0,3)
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
                  display: "ampleur-card",
                  engine,
                }}
              />
            )
          })
        }
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
    {['⭐ Parcours ampleur'].map((text) => (
      <li key={text}>{text}</li>
    ))}
  </Labels>
)
