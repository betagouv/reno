import { Main, PageBlock } from '@/components/UI'
import StatistiquesInternes from './StatistiquesInternes'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export default function Page() {
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <StatistiquesInternes />
      </PageBlock>
    </>
  )
}
