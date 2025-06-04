import Link from 'next/link'
import { CTA } from './UI'

export default function UserProblemBanner() {
  return (
    <CTA $fontSize="normal" $importance="emptyBackground">
      <Link href="/faq">
        <span aria-hidden="true">👋</span> J'ai besoin d'aide
      </Link>
    </CTA>
  )
}
