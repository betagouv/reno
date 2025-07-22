import Link from 'next/link'
import rules from '@/app/règles/rules'
import { encodeDottedName, encodeSituation } from '../publicodes/situationUtils'
import iconCalculator from '@/public/calculator.svg'
import { omit } from '@/components/utils'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { push } from '@socialgouv/matomo-next'

export default function AideCTAs({
  dottedName,
  situation,
  answeredQuestions,
  setSearchParams,
  expanded,
}) {
  const isMobile = window.innerWidth <= 600
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const { objectif, ...situationSearchParams } = searchParams

  const detailUrl = setSearchParams(
    encodeSituation({
      ['details']: encodeDottedName(dottedName),
    }),
    'url',
    false,
  )

  const backUrl =
    situation &&
    setSearchParams(
      {
        ...encodeSituation(
          omit(['details'], situation),
          false,
          answeredQuestions,
        ),
        ['objectif']: objectif,
      },
      'url',
      true,
    )

  return (
    <Link
      className={`fr-btn fr-btn--secondary ${!expanded && 'fr-icon-arrow-right-line fr-btn-icon--right'}`}
      href={expanded ? backUrl : detailUrl}
      onClick={() =>
        !expanded &&
        push(['trackEvent', 'Simulateur Principal', 'Détails', dottedName])
      }
    >
      <span
        css={`
          display: flex;
          justify-content: center;
          align-items: center;
          text-wrap: auto;
        `}
      >
        {expanded ? (
          <>Revenir à la liste des aides</>
        ) : (
          <>
            {[
              'MPR . accompagnée',
              'denormandie',
              "CEE . rénovation d'ampleur",
            ].includes(dottedName) ? (
              <>
                <Image
                  src={iconCalculator}
                  alt="icone calculatrice"
                  css={`
                    margin-right: 0.5rem;
                  `}
                />
                Calculer le montant d'aides
              </>
            ) : (
              <>
                En savoir plus{' '}
                {!isMobile && <>sur {rules[dottedName].marque}</>}
              </>
            )}
          </>
        )}
      </span>
    </Link>
  )
}
