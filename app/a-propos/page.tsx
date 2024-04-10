import Footer from '@/components/Footer'
import { Main, Section } from '@/components/UI'
import Link from 'next/link'
import { Metadata } from 'next/types'
import { parse } from 'marked'

const content = `

### À propos

Mes Aides Réno est un service conçu par la [Direction Interministérielle du Numérique](https://www.numerique.gouv.fr/dinum/) en partenariat avec avec [France Rénov'](https://france-renov.gouv.fr/) et le [Secrétariat général à la planification écologique (SGPE)](https://www.info.gouv.fr/france-nation-verte).

Ce service a pour objectif de simplifier l’accès à l’information sur les aides à la rénovation énergétique. Il est incubé par l'incubateur des services numériques de l'État, [beta.gouv](https://beta.gouv.fr). 

Mes Aides Réno a été lancé en version beta. L’objectif est de le confronter à des usagers pour le faire rapidement évoluer en fonction des premiers retours. 

Vous pouvez en apprendre davantage sur le problème que nous souhaitons résoudre, les solutions que nous expérimentons et comment nous comptons en étudier l'impact en lisant notre [fiche produit](https://www.beta.gouv.fr/startups/mesaidesreno.html).

#### Partenaires et développeurs

Mes Aides Réno a été conçu pour être facilement réutilisable et intégrable par des services tiers. 

Le code du site [est intégralement ouvert](https://github.com/betagouv/reno), et basé sur des bibliothèques elles-même ouvertes.

Le code métier est basé sur le langage [Publicodes](https://publi.codes/) pour maximiser son ouverture et sa lisibilité. [Une API](https://mesaidesreno.beta.gouv.fr/api-doc) est disponible pour comprendre notre modèle métier et réutiliser les données.

#### Mentions légales

Ce site Web est opéré par la [Direction Interministérielle du Numériques](https://annuaire-entreprises.data.gouv.fr/entreprise/direction-interministerielle-du-numerique-dinum-130025265). Il est hébergé sur un serveur français, comme expliqué sur la page [confidentialité](https://mesaidesreno.beta.gouv.fr/confidentialite).
`

export const metadata: Metadata = {
  title: 'À propos - Mes aides réno',
}

export default function About() {
  return (
    <Main>
      <Section dangerouslySetInnerHTML={{ __html: parse(content) }}></Section>
    </Main>
  )
}
