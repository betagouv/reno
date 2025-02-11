import { encodeSituation } from '@/components/publicodes/situationUtils'
import { omit } from '@/components/utils'
import Link from 'next/link'

export const situationToCtaUrl = (situation) => {
  // was probably a fix, should be removed from above now
  const notExtremeSituation = omit(['projet . travaux'], situation)
  return `/simulation?${new URLSearchParams(encodeSituation(notExtremeSituation, true, Object.keys(situation))).toString()}&depuisModule=oui`
}

export default function AmpleurCTA({ situation }) {
  const url = situationToCtaUrl(situation)
  return (
    <Link href={url}>
      <span>Affinez votre simulation en 3 min&nbsp;⚡️&nbsp;➞</span>
    </Link>
  )
}
