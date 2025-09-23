import rules from '@/app/règles/rules'
import { encodeDottedName, encodeSituation } from '../publicodes/situationUtils'
import { push } from '@socialgouv/matomo-next'
import useIsMobile from '../useIsMobile'
import Button from '@codegouvfr/react-dsfr/Button'

export default function AideCTAs({ dottedName, setSearchParams, isEligible }) {
  const isMobile = useIsMobile()

  const detailUrl = setSearchParams(
    encodeSituation({
      details: encodeDottedName(dottedName),
    }),
    'url',
    false,
  )
  const hasCalculette =
    [
      'MPR . accompagnée',
      'denormandie',
      "CEE . rénovation d'ampleur",
      'mpa',
      'locavantage',
      //"crédit d'impôt",
      'pch',
      'MPLD',
    ].includes(dottedName) && isEligible !== false

  return hasCalculette ? (
    <Button
      iconId="fr-icon-money-euro-circle-line"
      onClick={function () {
        push(['trackEvent', 'Simulateur Principal', 'Détails', dottedName])
        window.location.href = detailUrl
      }}
      priority="secondary"
    >
      Calculer le montant de l'aide
    </Button>
  ) : (
    <a
      title={`En savoir plus ${!isMobile ? `sur ${rules[dottedName]?.marque}` : ''} - nouvelle fenêtre`}
      href={rules[dottedName].lien}
      target="_blank"
      rel="noopener external"
      className="fr-link"
    >
      En savoir plus {!isMobile && `sur ${rules[dottedName]?.marque}`}
    </a>
  )
}
