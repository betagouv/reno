import { encodeSituation } from '@/components/publicodes/situationUtils'
import { omit } from '@/components/utils'
import Link from 'next/link'

export const situationToCtaUrl = (situation) => {
  const notExtremeSituation = omit(['projet . travaux'], situation)
  return `/simulation?${new URLSearchParams(encodeSituation(notExtremeSituation, true)).toString()}`
}

export default function AmpleurCTA({ situation }) {
  const url = situationToCtaUrl(situation)
  return (
    <Link href={url}>
      <span>Découvrir toutes les aides&nbsp;&nbsp;➞</span>
    </Link>
  )
}
