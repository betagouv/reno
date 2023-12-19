import Link from '@/node_modules/next/link'

export default function LinkAPI({ searchParams }) {
  return (
    <section>
      <h2>API</h2>

      <p>
        Vous pouvez aussi utiliser ce calculateur via{' '}
        <Link href="/api-doc">notre API</Link>.
      </p>
      <p>
        Voici{' '}
        <Link href={'/api?' + new URLSearchParams(searchParams)}>
          l'appel d'API
        </Link>{' '}
        correspondant à votre simulation en cours.
      </p>
    </section>
  )
}
