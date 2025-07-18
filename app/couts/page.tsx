import css from '@/components/css/convertToJs'
import dynamic from '@/node_modules/next/dynamic'
import logo from '@/app/icon.svg'
import Image from 'next/image'
import { Suspense } from 'react'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

const Couts = dynamic(() => import('./Couts'), { ssr: false })

// Using searchParams here will opt this route to dynamic rendering
export default async function Page(props) {
  const searchParams = await props.searchParams
  return (
    <>
      <StartDsfrOnHydration />
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
        <Suspense>
          <Couts searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  )
}
