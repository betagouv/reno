import css from '@/components/css/convertToJs'
import dynamic from '@/node_modules/next/dynamic'
import logo from '@/app/icon.svg'
import Image from 'next/image'

const Couts = dynamic(() => import('./Couts'), { ssr: false })

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
      <Couts searchParams={searchParams} />
    </main>
  )
}
