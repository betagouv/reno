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
          <Link href="/api-doc">API</Link>
        </li>
        <li>
          <Link href="/personas">Personas</Link>
        </li>
        <li>Accessibilité : non conforme</li>
        <li>
          <Link href="/confidentialite">
            Confidentialité et mentions légales
          </Link>
        </li>
        <li>
          <a href="https://github.com/betagouv/reno">Code source</a>
        </li>
      </ul>
    </FooterWrapper>
  )
}
