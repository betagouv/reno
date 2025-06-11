'use client'
import css from '@/components/css/convertToJs'
import marianneLogo from '@/public/marianne.svg'
import Image from 'next/image'
export default function DynamicHeaderIcon() {
  return (
    <Image
      src={marianneLogo}
      alt="Bloc Mariane officiel de la République Française"
      style={css`
        width: 7rem;
        margin-right: 0.6rem;
        height: auto;
        padding: 1vh 0;
      `}
    />
  )
}
