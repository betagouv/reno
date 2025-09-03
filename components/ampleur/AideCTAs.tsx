import rules from '@/app/règles/rules'
import { encodeDottedName, encodeSituation } from '../publicodes/situationUtils'
import { omit } from '@/components/utils'
import { useSearchParams } from 'next/navigation'
import { push } from '@socialgouv/matomo-next'
import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup'
import useIsMobile from '../useIsMobile'

export default function AideCTAs({ dottedName, setSearchParams }) {
  const isMobile = useIsMobile()

  const detailUrl = setSearchParams(
    encodeSituation({
      details: encodeDottedName(dottedName),
    }),
    'url',
    false,
  )

  return (
    <ButtonsGroup
      alignment="left"
      inlineLayoutWhen="always"
      buttons={[
        {
          children: [
            'MPR . accompagnée',
            'denormandie',
            "CEE . rénovation d'ampleur",
            'mpa',
            'locavantage',
            "crédit d'impôt",
            'pch',
          ].includes(dottedName) ? (
            <>
              <span
                className="fr-icon-money-euro-circle-line fr-mr-1v"
                aria-hidden="true"
              ></span>
              Calculer le montant d'aides
            </>
          ) : (
            `En savoir plus ${!isMobile && `sur ${rules[dottedName]?.marque}`}`
          ),
          linkProps: {
            href: detailUrl,
            onClick: () => {
              push([
                'trackEvent',
                'Simulateur Principal',
                'Détails',
                dottedName,
              ])
            },
            className: 'fr-icon-arrow-right-line fr-btn--icon-right',
          },
        },
      ]}
    />
  )
}
