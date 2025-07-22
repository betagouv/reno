'use client'
import { getRuleName } from './publicodes/utils'
import GesteDescription from './GesteDescription'
import { getInfoForPrime } from './AideGeste'

import { Badge } from '@codegouvfr/react-dsfr/Badge'
import { AideDurée } from './ampleur/AideAmpleur'
import { createExampleSituation } from './ampleur/AmpleurSummary'

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
  const bestSituation = createExampleSituation(situation, 'best')
  const { montantTotal, isExactTotal, eligibleMPRG, hasCoupDePouce } =
    getInfoForPrime({
      engine,
      dottedName,
      situation,
    })
  return (
    montantTotal != '0 €' && (
      <Badge
        noIcon
        severity={montantTotal !== 'Non applicable' ? 'success' : ''}
      >
        {montantTotal === 'Non applicable' ? (
          <>Non applicable dans votre situation</>
        ) : !eligibleMPRG && !hasCoupDePouce && !isExactTotal ? (
          <>Prime existante</>
        ) : (
          <>
            {isExactTotal
              ? !hasCoupDePouce && !eligibleMPRG
                ? 'Prime indicative de '
                : 'Prime de '
              : "Jusqu'à "}
            {montantTotal == 0 ? '0 €' : montantTotal}
            <AideDurée
              {...{
                engine,
                situation: bestSituation,
                dottedName: dottedName + ' . montant',
              }}
            />
          </>
        )}
      </Badge>
    )
  )
}
