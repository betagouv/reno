import { Section } from '@/components/UI'
import Link from '@/node_modules/next/link'

export default function LinkAPI({ searchParams }) {
  return (
    <Section>
      <h2>Partage</h2>

      <p>
        En partageant{' '}
        <Link href={'?' + new URLSearchParams(searchParams)}>ce lien</Link> a
        des amis, de la famille ou un conseiller, vous leur donnerez accès à vos
        données et résultats de simulation.
      </p>
    </Section>
  )
}
