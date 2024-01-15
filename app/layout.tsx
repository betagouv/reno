import css from '@/components/css/convertToJs'
import logo from '@/public/icon.svg'
import marianneLogo from '@/public/marianne.svg'
import Image from 'next/image'
import StyledComponentsRegistry from '../lib/registry'
import './globals.css'

import { TopBanner } from '@/components/UI'
import localFont from 'next/font/local'
import { description } from './page'

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
          <TopBanner>
            <strong>
              🚧 En cours de développement, peu fiable, métropole seulement
            </strong>
          </TopBanner>
          <header
            style={css`
              margin-top: 0.4rem;
              margin-bottom: calc(1.5vh + 1.5vw);
              --shadow-color: 0deg 0% 63%;
              --shadow-elevation-medium: 0.3px 0.5px 0.7px
                  hsl(var(--shadow-color) / 0.36),
                0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
                2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
                5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
              box-shadow: var(--shadow-elevation-medium);
              padding: 1vh;
              width: 100%;
            `}
          >
            <div
              style={css`
                max-width: 800px;
                margin: 0 auto;
              `}
            >
              <div
                style={css`
                  display: flex;
                  align-items: center;
                `}
              >
                <Image
                  src={marianneLogo}
                  alt="Bloc Mariane officiel de la République Française"
                  style={css`
                    width: 10vh;
                    margin-right: 0.6rem;
                    height: auto;
                  `}
                />
                <Image
                  src={logo}
                  alt="Logo Mes Aides Rénovation 2024"
                  style={css`
                    width: 2rem;
                    margin-right: 0.6rem;
                    height: auto;
                    padding-top: 0.5rem;
                  `}
                />
                <h1>Calculez vos aides rénovation &nbsp;2024</h1>
              </div>
              <small>{description}</small>
            </div>
          </header>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
