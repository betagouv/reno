import css from '@/components/css/convertToJs'
import Form from './Form'
import logo from '@/public/icon.svg'
import Image from 'next/image'
import rules from './rules'
import Footer from '@/components/Footer'
import { PageBlock, TopBanner } from '@/components/UI'

const description = `Calculez les aides 2024 à la rénovation de votre logement, dont Ma Prime Rénov.`

export const metadata: Metadata = {
  title: 'Aides réno 2024',
  description,
}

export default function Page({ searchParams }) {
  return (
    <PageBlock>
      <TopBanner>
        <strong>
          🚧 En cours de développement, peu fiable, métropole seulement
        </strong>
      </TopBanner>
      <header
        style={css`
          margin-top: 1rem;
          margin-bottom: 1rem;
        `}
      >
        <div
          style={css`
            display: flex;
            align-items: center;
          `}
        >
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
          <h1>Mes Aides Réno&nbsp;2024</h1>
        </div>
        <small>{description}</small>
      </header>
      <main>
        <Form searchParams={searchParams} rules={rules} />
      </main>
      <Footer />
    </PageBlock>
  )
}
