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
        `}
      >
        <Link href="/faq">Une question, un problème ?</Link>
      </CTA>
    </CTAWrapper>
  )
}
