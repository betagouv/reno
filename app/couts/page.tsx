import css from '@/components/css/convertToJs'
import logo from '@/public/icon.svg'
import Image from 'next/image'
import Couts from './Couts'

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
        <h1>Prix des gestes de réno</h1>
      </header>
      <p>Une analyse des coûts des gestes d'isolation</p>
      <Couts />
    </main>
  )
}
