'use client'
import { HeaderWrapper } from '@/app/LayoutUI'
import MarianneHeaderLogo from '@/app/MarianneHeaderLogo'
import css from '@/components/css/convertToJs'
import useIsInIframe from '@/components/useIsInIframe'
import logo from '@/public/logo-service-de-FR.svg'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styled from 'styled-components'
import { useMediaQuery } from 'usehooks-ts'
import Menu from './Menu'

export default function Header() {
  const isInIframe = useIsInIframe()
  const isMobile = useMediaQuery('(max-width: 800px)')
  const pathname = usePathname()
  if (pathname.startsWith('/module/') && pathname.endsWith('integration'))
    return

  return (
    <HeaderWrapper>
      <nav>
        <Link
          href="/"
          style={css`
            text-decoration: none;
            color: inherit;
          `}
          target={isInIframe ? '_blank' : undefined}
        >
          <div
            style={css`
              display: flex;
              align-items: center;
            `}
          >
            {!isMobile && <MarianneHeaderLogo />}
            <div
              style={css`
                display: flex;
                align-items: center;
                margin-left: 1vw;
              `}
            >
              <HeaderLogo src={logo} alt={logoAlt} $needsMargin={!isMobile} />
            </div>
          </div>
        </Link>
        <Menu isMobile={isMobile} />
      </nav>
    </HeaderWrapper>
  )
}

const HeaderLogo = styled(Image)`
  height: 4.5rem;
  width: auto;
  ${(p) => p.$needsMargin && `margin-left: 0rem;`}
`
export const logoAlt =
  "Logo Mes Aides Réno, représentant une maison bleu blanc rouge ainsi que la marque à laquellee le service est rattaché, le visage souriant France Rénov' avec un toît en guise de couvre-chef."
