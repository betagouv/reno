import css from '@/components/css/convertToJs'
import StyledComponentsRegistry from '../lib/registry'
import Link from 'next/link'
import './globals.css'

import { TopBanner } from '@/components/UI'
import localFont from 'next/font/local'
import DynamicHeaderIcon from './DynamicHeaderIcon'

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
              margin-top: 1.6rem;
              margin-bottom: calc(1.5vh + 1.5vw);
              box-shadow: var(--shadow-elevation-medium);
              padding: 0 1vh;
              width: 100%;
            `}
          >
            <Link
              href="/"
              style={css`
                text-decoration: none;
                color: inherit;
              `}
            >
              <div
                style={css`
                  max-width: 800px;
                  margin: 0 auto;
                  display: flex;
                  align-items: center;
                `}
              >
                <h1
                  style={css`
                    margin: 1vh 0;
                    margin-left: 1vw;
                    font-size: 140%;
                  `}
                >
                  Mes aides réno
                </h1>
              </div>
            </Link>
          </header>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
