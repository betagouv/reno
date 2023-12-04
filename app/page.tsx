import Form from './Form'

export default function Page({ searchParams }) {
  return (
    <main>
      <h1>MAR</h1>
      <p>Mes Aides Rénovation 2024</p>
      <Form searchParams={searchParams} />
    </main>
  )
}
