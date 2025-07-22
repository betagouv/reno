import Link from 'next/link'
import Image from 'next/image'
import coproImage from '@/public/blog-images/vignette-copro.svg'
import css from './css/convertToJs'

export default function CoproCTA() {
  return (
    <Link
      className="fr-btn"
      href="/copropriete"
      prefetch={false}
      style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
      }}
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
      Estimer mes aides copro
    </Link>
  )
}
