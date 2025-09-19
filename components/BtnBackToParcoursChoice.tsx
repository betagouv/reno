import { encodeSituation } from './publicodes/situationUtils'
import { push } from '@socialgouv/matomo-next'
import Link from 'next/link'

export default function BtnBackToParcoursChoice({
  setSearchParams,
  situation,
  answeredQuestions,
  text = 'Retour',
  whichSimulator = 'Simulateur Principal',
}) {
  const backUrl = setSearchParams(
    {
      ...encodeSituation(situation, false, answeredQuestions),
    },
    'url',
    true,
  )

  return (
    <Link
      className="fr-btn fr-btn--tertiary fr-icon-arrow-left-line fr-btn--icon-left"
      href={backUrl}
      onClick={() =>
        push(['trackEvent', whichSimulator, 'Clic', 'retour choix parcours'])
      }
    >
      {text}
    </Link>
  )
}
