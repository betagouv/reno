import Link from 'next/link'
import { FooterWrapper } from './UI'

export default function Footer() {
  return (
    <FooterWrapper>
      <ul>
        <li>
          <Link href="/api-doc">API</Link>
        </li>
        <li>Accessibilité : non conforme</li>
        <li>Vie privée : à venir</li>
        <li>
          <a href="https://github.com/betagouv/reno">Code source</a>
        </li>
      </ul>
    </FooterWrapper>
  )
}
