import './globals.css'
import StyledComponentsRegistry from '../lib/registry'

import localFont from 'next/font/local'

const marianne = localFont({
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
      <body className={marianne.className}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
