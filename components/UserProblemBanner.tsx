import Link from 'next/link'
import { CTA, CTAWrapper } from './UI'
import css from './css/convertToJs'

export default function UserProblemBanner() {
  return (
    <CTAWrapper $justify="left">
      <CTA
        $fontSize="normal"
        $importance="secondary"
        style={css`
          padding: 0.5rem 0;
          width: 800px;
          text-align: center;
        `}
      >
        <Link href="/faq">👋 J'ai besoin d'aide</Link>
      </CTA>
    </CTAWrapper>
  )
}
