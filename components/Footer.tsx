import Link from 'next/link'
import { FooterWrapper } from './UI'

export default function Footer() {
  return (
    <FooterWrapper>
      <ul>
        <li>
          <Link href="/a-propos">À propos</Link>
        </li>
        <li>
          <Link href="/faq">Questions et contact</Link>
        </li>
        <li>
          <Link href="/api-doc">API</Link>
        </li>
        <li>
          <Link href="/integration">Intégrer notre calculateur</Link>
        </li>
        <li>
          <Link href="/personas">Personas</Link>
        </li>
        <Link href="/accessibilite">Accessibilité : non conforme</Link>
        <li>
          <Link href="/confidentialite">Confidentialité</Link>
        </li>
      </ul>
    </FooterWrapper>
  )
}
