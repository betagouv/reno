'use client'
import DynamicHeaderIcon from '@/app/DynamicHeaderIcon'
import { HeaderWrapper, Title } from '@/app/LayoutUI'
import css from '@/components/css/convertToJs'
import useIsInIframe from '@/components/useIsInIframe'
import logo from '@/public/logo-service-de-FR.svg'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoCompact from './LogoCompact'
import { CTA } from './UI'
import styled from 'styled-components'

export default function Header() {
  const isInIframe = useIsInIframe()
  const pathname = usePathname()
  if (pathname.startsWith('/module/') && pathname.endsWith('integration'))
    return

  return isInIframe ? (
    <LogoCompact />
  ) : (
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
            <DynamicHeaderIcon />
            <div
              style={css`
                display: flex;
                align-items: center;
                margin-left: 1vw;
              `}
            >
              <HeaderLogo
                src={logo}
                alt="Logo Mes Aides Réno, représentant une maison bleu blanc rouge"
              />
            </div>
          </div>
        </Link>
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
      </nav>
    </HeaderWrapper>
  )
}

const HeaderLogo = styled(Image)`
  height: 4.5rem;
  width: auto;
  margin-bottom: 1.4rem;
`
