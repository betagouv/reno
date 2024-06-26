import css from '@/components/css/convertToJs'
import Matomo from '@/utils/Matomo'
import Link from 'next/link'
import StyledComponentsRegistry from '../lib/registry'
import './globals.css'

import Footer from '@/components/Footer'
import logo from '@/public/logo.svg'
import localFont from 'next/font/local'
import Image from 'next/image'
import DynamicHeaderIcon from './DynamicHeaderIcon'
import { Header, Title } from './LayoutUI'
import { description } from './page'

export async function generateMetadata(
  { params, searchParams }: Props,
  parent?: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: 'Mes aides réno 2024',
    description: description,
    metadataBase: new URL('https://mesaidesreno.beta.gouv.fr'),
    openGraph: {
      images: ['/jaquette.png'],
    },
  }
}

const marianneFont = localFont({
  src: [
    {
      path: '../fonts/Marianne-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../fonts/Marianne-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/Marianne-Regular.woff2',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: '../fonts/Marianne-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/Marianne-Bold.woff2',
      weight: 'bold',
      style: 'normal',
    },
    {
      path: '../fonts/Marianne-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-marianne',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={marianneFont.className}>
        <StyledComponentsRegistry>
          <Header>
            <nav>
              <Link
                href="/"
                style={css`
                  text-decoration: none;
                  color: inherit;
                `}
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
                    <Image
                      src={logo}
                      alt="Logo Mes Aides Réno, représentant une maison bleu blanc rouge"
                    />
                    <Title>
                      Mes <strong>Aides Réno</strong>
                    </Title>
                    <strong
                      title="Les résultats présentés sur ce site sont une simulation, en version beta : elle est à but d'information mais peut contenir des erreurs. Elle ne remplace ni la loi, ni les informations présentées sur https://france-renov.gouv.fr, ni les conseillers France Rénov'"
                      style={css`
                        background: #e8edff;
                        color: #0063cb;
                        padding: 0.1rem 0.3rem;
                        border-radius: 0.1rem;
                        margin-left: 0.6rem;
                        font-size: 110%;
                      `}
                    >
                      BETA
                    </strong>
                  </div>
                </div>
              </Link>
              <div>
                <Link href="/a-propos">À propos</Link>
                <Link href="/faq">Questions et contact</Link>
                <Link href="/integration">Partenaires</Link>
              </div>
            </nav>
          </Header>
          {children}

          <Footer />
        </StyledComponentsRegistry>
        <Matomo />
      </body>
    </html>
  )
}
