import { Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import Liste from './Liste'
import Link from 'next/link'

const description =
  'Les aides locales à la rénovation énergétique dépendent de chaque région, département, métropole, communauté de communes, commune. Elles vont de la subvention de panneaux solaires, à la rénovation globale (saut de 2 DPE), avec parfois un bonus pour une cible bâtiment basse consommation (BBC).'
export const metadata: Metadata = {
  title: 'Liste des aides locales - Mes aides réno',
  description,
}

export default function AidesLocales({ searchParams }) {
  return (
    <Main>
      <Section>
        <h1>Les aides locales en France</h1>
        <p>{description}</p>
        <p>
          Cette liste est la seule base ouverte d'aides locales implémentées,
          mais elle n'est pas encore complète : si vous avez des informations
          précises sur une aide locale,{' '}
          <Link href="/faq">contactez-nous !</Link>.
        </p>
        <Liste />
      </Section>
    </Main>
  )
}
