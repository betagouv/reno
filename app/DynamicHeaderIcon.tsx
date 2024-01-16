'use client'
import { usePathname } from 'next/navigation'
import logo from '@/public/icon.svg'
import marianneLogo from '@/public/marianne.svg'
import marianneSansTexte from '@/public/marianne-sans-texte.svg'
import Image from 'next/image'
import css from '@/components/css/convertToJs'
export default function DynamicHeaderIcon() {
  const pathname = usePathname()

  const simulating = pathname.includes('/simulation')
  return (
    <Image
      src={!simulating ? marianneLogo : marianneSansTexte}
      alt="Bloc Mariane officiel de la République Française"
      style={css`
        width: min(10vh, 15vw);
        margin-right: 0.6rem;
        height: auto;
      `}
    />
  )
}
