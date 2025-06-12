import Link from 'next/link'
import { CTA } from './UI'

export default function Menu() {
  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <Link href="/blog">Blog</Link>
      <Link href="/aides">Les aides</Link>
      <Link href="/contact">Contact</Link>
      <CTA
        $fontSize="normal"
        css={`
          line-height: 1;
          margin-left: 1rem;
          a {
            padding: 0.2rem 1rem;
          }
          padding: 0.5rem 0;
        `}
      >
        <Link href="/devenir-partenaire">Devenir partenaire</Link>
      </CTA>
    </div>
  )
}
