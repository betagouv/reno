import Link from 'next/link'
import { CTA, CTAWrapper } from './UI'
import Image from 'next/image'
import coproImage from '@/public/blog-images/vignette-copro.svg'
import css from './css/convertToJs'

export default function CoproCTA() {
  return (
    <CTAWrapper $justify="left">
      <CTA $fontSize="normal">
        <Link
          href="/copropriete"
          prefetch={false}
          style={css`
            display: flex;
            gap: 1rem;
            align-items: center;
          `}
        >
          <Image
            src={coproImage}
            alt="Icône immeuble"
            style={css`
              filter: invert(1);
              width: 3rem;
              height: auto;
              padding: 0;
              margin: 0;
            `}
          />
          <span style={{ fontSize: '140%' }}>Estimer mes aides copro</span>
        </Link>
      </CTA>
    </CTAWrapper>
  )
}
