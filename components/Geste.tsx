'use client'
import { getRuleName } from './publicodes/utils'
import { PrimeStyle } from './UI'
import GesteDescription from './GesteDescription'
import { getInfoForPrime } from './AideGeste'

// Dans le cas où l'on est éligible qu'au CEE mais pas MPR ni coup de pouce, il faut adapter la formulation
export const PrimeDisplay = ({
  situation,
  engine,
  rules,
  dottedName,
  description = true,
}) => (
  <div>
    <h3
      css={`
        margin: 0 0 0.5rem 0 !important;
        font-size: 120%;
        color: var(--color);
      `}
    >
      {rules[dottedName].titre || getRuleName(dottedName)}
    </h3>
    {description && <GesteDescription rule={rules[dottedName]} />}

    <PrimeBadge
      {...{
        situation,
        engine,
        dottedName,
      }}
    />
  </div>
)

export const PrimeBadge = ({ engine, dottedName, situation }) => {
  const { montantTotal, isExactTotal, eligibleMPRG, hasCoupDePouce } =
    getInfoForPrime({
      engine,
      dottedName,
      situation,
    })
  return (
    <PrimeStyle
      css={`
        display: block;
        text-align: left;
        text-wrap: wrap;
      `}
      $inactive={montantTotal === 'Non applicable'}
    >
      {montantTotal === 'Non applicable' ? (
        <>
          Prime <strong>non applicable</strong> dans votre situation
        </>
      ) : !eligibleMPRG && !hasCoupDePouce && !isExactTotal ? (
        <>Prime existante</>
      ) : (
        <>
          {isExactTotal
            ? !hasCoupDePouce && !eligibleMPRG
              ? 'Prime indicative de '
              : 'Prime de '
            : "Jusqu'à "}
          <strong>{montantTotal == 0 ? '0 €' : montantTotal}</strong>{' '}
        </>
      )}
    </PrimeStyle>
  )
}
