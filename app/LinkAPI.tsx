import Link from '@/node_modules/next/link'

export default function LinkAPI({ searchParams }) {
  return (
    <section>
      <h2>Partage</h2>

      <p>
        Voici{' '}
        <Link href={'?' + new URLSearchParams(searchParams)}>
          le lien vers votre simulation
        </Link>{' '}
        actuelle.
      </p>
    </section>
  )
}
