'use client'
import Image from 'next/image'
import logo from '@/public/logo.svg'
import useIsInIframe from '@/components/useIsInIframe'
import styled from 'styled-components'

export default function Breadcrumb({links}) {
  const isInIframe = useIsInIframe()
  return !isInIframe && (
    <BreadcrumbNav>
        <BreadcrumbLink href="/">
            <Image
                src={logo}
                alt="Logo Mes Aides Réno, représentant une maison bleu blanc rouge"
                width="32"
            />
            Accueil
        </BreadcrumbLink>
        {links.map((link, index) => {
            const titre = Object.keys(link)[0];
            return (<BreadcrumbLink key={index} href={link[titre]}>{titre}</BreadcrumbLink>)
        })}
    </BreadcrumbNav>
  )
}
export const BreadcrumbNav = styled.nav`
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    color: #666;
    font-size: 0.8rem;
    a:first-child {
        img {
            margin-right: .5rem;
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
        content: "";
        display: inline-block;
        flex: 0 0 auto;
        height: 1rem;
        margin-left: .25rem;
        margin-right: .25rem;
        -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0ibTEzLjE3MiAxMi00Ljk1LTQuOTUgMS40MTQtMS40MTRMMTYgMTJsLTYuMzY0IDYuMzY0LTEuNDE0LTEuNDE0IDQuOTUtNC45NVoiLz48L3N2Zz4=);
        mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0ibTEzLjE3MiAxMi00Ljk1LTQuOTUgMS40MTQtMS40MTRMMTYgMTJsLTYuMzY0IDYuMzY0LTEuNDE0LTEuNDE0IDQuOTUtNC45NVoiLz48L3N2Zz4=);
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
        vertical-align: -.0625em;
        width: 1rem;
    }
`