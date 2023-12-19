import css from '@/components/css/convertToJs'
import Form from './Form'
import logo from '@/public/icon.svg'
import Image from 'next/image'

export default function Page({ searchParams }) {
  return (
    <main
      style={css`
        width: 700px;
        max-width: 96vw;
        padding: 0 0.6rem;
        margin: 0 auto;
      `}
    >
      <header
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
      </header>
      <p>
        Cet outil calcule les aides 2024 à la rénovation de votre logement.{' '}
        <strong
          style={css`
            background: salmon;
            padding: 0 0.2rem;
            white-space: nowrap;
          `}
        >
          En cours de développement. Peu fiable.
        </strong>
      </p>
      <Form searchParams={searchParams} />
    </main>
  )
}
