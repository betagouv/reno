import { Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import rules from '@/app/règles/rules'

const description =
  "Les aides locales à la rénovation énergétique dépendent de chaque région, département, métropole, communauté de communes, commune. Elles peuvent aller de l'aide à l'installation de panneaux solaires, à une aide à la rénovation globale pour sauter 2 DPE, avec souvent des bonus pour ceux qui ciblent un bâtiment basse consommation (BBC)."
export const metadata: Metadata = {
  title: 'Liste des aides locales - Mes aides réno',
  description,
}

export default function AidesLocales({ searchParams }) {
  return (
    <Main>
      <Section>
        <h1>Les aides locales en Frace</h1>
        <p>{description}</p>
        <p>
          Cette liste est la seule base ouverte d'aides locales implémentées,
          mais elle n'est pas encore complète : si vous avez des informations
          précises sur une aide locale, contactez-nous !
        </p>
      </Section>
    </Main>
  )
}
