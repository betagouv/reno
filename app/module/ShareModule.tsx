import { InternalLink } from '@/components/UI'
import Image from 'next/image'
import codeIcon from '@/public/icon-code.png'
import css from '@/components/css/convertToJs'

export default function ShareModule({ titre }) {
  return (
    <InternalLink
      href={`/integration?module=${encodeURIComponent('/module/' + titre)}`}
      style={css`
        display: flex;
        align-items: center;
        width: fit-content;
        gap: 0.5rem;
      `}
    >
      <Image src={codeIcon} alt="icone intégration iframe" width="24" />
      Intégrer ce widget à mon site
    </InternalLink>
  )
}
