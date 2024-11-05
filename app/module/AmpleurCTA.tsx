import { encodeSituation } from '@/components/publicodes/situationUtils'
import { omit } from '@/components/utils'
import Link from 'next/link'

export default function AmpleurCTA({ situation }) {
  const notExtremeSituation = omit(['projet . travaux'], situation)

  return (
    <Link
      href={`/simulation?${new URLSearchParams(encodeSituation(notExtremeSituation, true)).toString()}`}
    >
      <span>Découvrir toutes les aides&nbsp;&nbsp;➞</span>
    </Link>
  )
}
