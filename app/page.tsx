import css from '@/components/css/convertToJs'
import Form from './Form'
import logo from '@/public/icon.svg'
import Image from 'next/image'
import rules from './rules'

const description = `Cet outil calcule les aides 2024 à la rénovation de votre logement, dont Ma Prime Rénov.`

export const metadata: Metadata = {
  title: 'Aides réno 2024',
  description,
}

export default function Page({ searchParams }) {
  return (
    <main>
      <p>
        <strong
          style={css`
            position: fixed;
            margin: 0 auto;
            top: 0;
            background: salmon;
            padding: 0 0.2rem;
            white-space: nowrap;
            padding: 0 1rem;
          `}
        >
          🚧 En cours de développement, peu fiable, métropole seulement
        </strong>
      </p>
      <header
        style={css`
          margin-top: 1rem;
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
      </header>
      {description}
      <Form searchParams={searchParams} rules={rules} />
    </main>
  )
}
