import css from '@/components/css/convertToJs'
import Form from './Form'

export default function Page({ searchParams }) {
  return (
    <main
      style={css`
        max-width: 700px;
        margin: 0 auto;
      `}
    >
      <h1>MAR</h1>
      <p>Mes Aides Rénovation 2024</p>
      <Form searchParams={searchParams} />
    </main>
  )
}
