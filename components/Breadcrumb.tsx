'use client'
import Image from 'next/image'
import logo from '@/public/logo-sans-nom.svg'
import useIsInIframe from '@/components/useIsInIframe'
import styled from 'styled-components'

export default function Breadcrumb({ links }) {
  const isInIframe = useIsInIframe()
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600
  return (
    !isInIframe && (
      <BreadcrumbNav $isMobile={isMobile}>
        <BreadcrumbLink href="/">
          <Image
            src={logo}
            alt="Logo cliquable Mes Aides Réno redirigeant vers l'accueil"
            width="32"
          />
          {!isMobile && <>Accueil</>}
        </BreadcrumbLink>
        {links.map((link, index) => {
          const titre = Object.keys(link)[0]
          return (
            <BreadcrumbLink key={index} href={link[titre]}>
              {titre}
            </BreadcrumbLink>
          )
        })}
      </BreadcrumbNav>
    )
  )
}
export const BreadcrumbNav = styled.nav`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  color: #666;
  font-size: ${(p) => (p.$isMobile ? '0.7rem' : '0.8rem')};
  a:first-child {
    img {
      ${(p) => p.$isMobile || 'margin-right: 0.5rem;'}
    }
    &::before {
      display: none;
    }
  }
`

export const BreadcrumbLink = styled.a`
  display: flex;
  align-items: center;
  color: #666;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
  &::before {
    background-color: #666;
    content: '';
    display: inline-block;
    flex: 0 0 auto;
    height: 1rem;
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0ibTEzLjE3MiAxMi00Ljk1LTQuOTUgMS40MTQtMS40MTRMMTYgMTJsLTYuMzY0IDYuMzY0LTEuNDE0LTEuNDE0IDQuOTUtNC45NVoiLz48L3N2Zz4=);
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0ibTEzLjE3MiAxMi00Ljk1LTQuOTUgMS40MTQtMS40MTRMMTYgMTJsLTYuMzY0IDYuMzY0LTEuNDE0LTEuNDE0IDQuOTUtNC45NVoiLz48L3N2Zz4=);
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    vertical-align: -0.0625em;
    width: 1rem;
  }
`
