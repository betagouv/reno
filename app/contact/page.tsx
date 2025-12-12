import { PageBlock } from '@/components/UI'
import { Metadata } from 'next/types'
import Contact from './Contact'
import { StartDsfrOnHydration } from '@codegouvfr/react-dsfr/next-app-router'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'

export const metadata: Metadata = {
  title: 'Contact - Mes aides réno',
}

export default function PageContact() {
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <Breadcrumb
          currentPageLabel="Contact"
          homeLinkProps={{
            href: '/',
          }}
          segments={[]}
        />
        <h1>Nous contacter</h1>
        <p>
          Pour des demandes privées ou nécessitant une réponse, vous pouvez
          écrire directement à l'équipe à{' '}
          <a className="fr-link" href="mailto:mesaidesreno@anah.gouv.fr">
            notre adresse mel
          </a>
          .
        </p>
        <Contact fromLocation="contact" />
      </PageBlock>
    </>
  )
}
