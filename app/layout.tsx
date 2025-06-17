import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Matomo from '@/utils/Matomo'
import localFont from 'next/font/local'
import StyledComponentsRegistry from '../lib/registry'
import './globals.css'
import { description } from './page'
import FooterContent from '@/components/FooterContent'

export async function generateMetadata(
  { params, searchParams }: Props,
  parent?: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: 'Mes aides réno 2025',
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
          <Header />
          {children}
          <Footer>
            <FooterContent />
          </Footer>
        </StyledComponentsRegistry>
        <Matomo />
      </body>
    </html>
  )
}
