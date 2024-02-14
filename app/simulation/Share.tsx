import { Section } from '@/components/UI'
import dynamic from '@/node_modules/next/dynamic'
import Link from '@/node_modules/next/link'
const ShareButton = dynamic(() => import('@/components/ShareButton'), {
  ssr: false,
})

export default function LinkAPI({ searchParams }) {
  return (
    <Section>
      <h2>Partage</h2>

      <p>
        En partageant ce lien à des amis, de la famille ou un conseiller, vous
        leur donnerez accès à vos données et résultats de simulation.
      </p>
      <ShareButton
        {...{
          text: 'Voici ma simulation Aides réno 2024',
          title: 'Mes aides réno',
        }}
      />
    </Section>
  )
}
