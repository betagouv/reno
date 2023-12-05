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
      <h1>Mes Aides Rénovation 2024</h1>
      <p>Ce petit calculateur vous aide à savoir si vous pouvez prétendre à des aides pour la rénovation de votre logement.</p>
      <Form searchParams={searchParams} />
    </main>
  )
}
