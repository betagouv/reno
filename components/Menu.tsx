import Link from 'next/link'
import { CTA } from './UI'
import { useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import menuIcon from '@/public/menu.svg'
import closeMenuIcon from '@/public/menu-close.svg'

export default function Menu({ isMobile }) {
  const [state, setState] = useState(isMobile ? 'closed' : 'desktop')

  if (state === 'desktop') return <MenuContent />
  if (state === 'closed')
    return <BurgerButton {...{ state: 'open', setState }} />
  if (state === 'open')
    return (
      <>
        <BurgerButton {...{ state: 'closed', setState }} />
        <MenuContent />
      </>
    )
}

const BurgerButton = ({ state, setState }) => {
  return (
    <Button
      onClick={() => setState(state)}
      title={state === 'open' ? 'Ouvrir le menu' : 'Fermer le menu'}
    >
      <Image
        src={state === 'open' ? menuIcon : closeMenuIcon}
        alt="Icône dite burger représentant un menu de navigation"
      />
    </Button>
  )
}
const Button = styled.button`
  img {
    margin-top: 0.6rem;
    width: 1.8rem;
    height: auto;
  }
  border: none;
  background: none;
`

const MenuContent = () => {
  return (
    <MenuWrapper>
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
    </MenuWrapper>
  )
}

const MenuWrapper = styled.div`
  margin: 0.4rem 0;
  display: flex;
  align-items: center;
  > a {
    margin: 0 0.6rem;
    display: inline-block;
    text-decoration: none;
    font-weight: 500;
    font-size: 90%;
  }
`
