import Link from 'next/link'
import rules from '@/app/règles/rules'
import { CTA } from '../UI'
import {
  encodeDottedName,
  encodeSituation,
  getSituation,
} from '../publicodes/situationUtils'
import iconCalculator from '@/public/calculator.svg'
import iconFlecheDroite from '@/public/fleche-droite-bleue.svg'
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

  const detailUrl = setSearchParams(
    {
      ...encodeSituation(
        {
          ...getSituation(searchParams, rules),
          ['details']: encodeDottedName(dottedName),
        },
        false,
        answeredQuestions,
      ),
    },
    'url',
    true,
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
      },
      'url',
      true,
    )

  return (
    <CTA
      $fontSize="normal"
      $importance="emptyBackground"
      css={`
        margin: ${expanded ? '1rem auto' : '1rem 0'};
      `}
    >
      <Link
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
              <Image
                src={iconFlecheDroite}
                alt="icone fleche"
                css={`
                  margin-left: 0.5rem;
                `}
              />
            </>
          )}
        </span>
      </Link>
    </CTA>
  )
}
