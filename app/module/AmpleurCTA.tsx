import { encodeSituation } from '@/components/publicodes/situationUtils'
import { omit } from '@/components/utils'
import Link from 'next/link'

export const situationToCtaUrl = (situation) => {
  // was probably a fix, should be removed from above now
  const notExtremeSituation = omit(['projet . travaux'], situation)
  return `/simulation?${new URLSearchParams(encodeSituation(notExtremeSituation, true, Object.keys(situation))).toString()}&depuisModule=oui`
}

export default function AmpleurCTA({
  situation,
  isMobile = false,
  target = '_self',
  text = 'Affinez vos aides en 3 min',
  textMobile = 'Affinez vos aides en 3 min',
}) {
  const url = situationToCtaUrl(situation)
  return (
    <Link
      className="fr-btn fr-icon-arrow-right-line fr-btn--icon-right fr-raw-link"
      href={url}
      title={target == '_self' ? text : text + ' - nouvelle fenêtre'}
      target={target}
    >
      {isMobile ? textMobile : text}&nbsp;⚡️
    </Link>
  )
}
