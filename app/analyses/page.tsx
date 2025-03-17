import logo from '@/app/icon.svg'
import css from '@/components/css/convertToJs'
import Image from 'next/image'
import Analyses from './Analyses'

export default function Page(props) {
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
        <h1>Analyses</h1>
      </header>
      <p>Analyses sur la base du modèle Mes Aides Réno</p>
      <Analyses />
    </main>
  )
}
