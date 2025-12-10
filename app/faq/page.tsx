import { PageBlock } from '@/components/UI'
import FAQ from './FAQ'
import { Metadata } from 'next/types'
import Contact from '../contact/Contact'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export const metadata: Metadata = {
  title: 'Questions fréquentes - Mes aides réno',
}

export default async function FaqPage(props) {
  const searchParams = await props.searchParams
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <FAQ />
        <h2>Nous contacter par mail</h2>
        <p>
          Pour des demandes privées ou nécessitant une réponse, vous pouvez
          écrire directement à l'équipe à{' '}
          <a className="fr-link" href="mailto:mesaidesreno@anah.gouv.fr">
            notre adresse mel
          </a>
          .
        </p>
        <Contact fromLocation={searchParams.fromLocation} />
      </PageBlock>
    </>
  )
}
