import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import MarSearch from './MarSearch'
import { PageBlock } from '@/components/UI'
import { Breadcrumb } from '@codegouvfr/react-dsfr/Breadcrumb'

export default async function MarPage(props) {
  const searchParams = await props.searchParams
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <Breadcrumb
          currentPageLabel="Conseiller France Rénov'"
          homeLinkProps={{
            href: '/',
          }}
          segments={[]}
        />
        <h1>Où trouver mon conseiller France Rénov' ? </h1>
        <MarSearch
          searchParams={searchParams}
          what="trouver-conseiller-renov"
        />
      </PageBlock>
    </>
  )
}
