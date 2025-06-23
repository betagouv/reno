import Link from 'next/link'
import { CTA } from './UI'
import css from './css/convertToJs'

export default function UserProblemBanner() {
  return (
    <CTA
      $fontSize="normal"
      $importance="secondary"
      style={css`
        padding: 0.5rem 0;
        width: 800px;
        max-width: 100%;
        text-align: center;
        border-color: #dddddd;
      `}
    >
      <Link href="/faq">👋 J'ai besoin d'aide</Link>
    </CTA>
  )
}
