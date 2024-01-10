import css from '@/components/css/convertToJs'
import Form from './Form'
import logo from '@/public/icon.svg'
import marianne from '@/public/marianne.svg'
import Image from 'next/image'
import rules from './rules'
import Footer from '@/components/Footer'
import { PageBlock, TopBanner } from '@/components/UI'

const description = `Calculez les aides Ma Prime Rénov' 2024 pour la rénovation de votre logement.`

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
              src={marianne}
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
            <h1>Mes Aides Réno&nbsp;2024</h1>
          </div>
          <small>{description}</small>
        </div>
      </header>
      <main>
        <Form searchParams={searchParams} rules={rules} />
      </main>
      <Footer />
    </PageBlock>
  )
}
