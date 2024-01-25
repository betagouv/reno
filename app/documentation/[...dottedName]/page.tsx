import { getSituation } from '@/components/publicodes/situationUtils'
import { Main, Section } from '@/components/UI'
import ClientDocumentation from './ClientDocumentation'

export default function RuleDocumentation({
  params: { dottedName: rawDottedName },
  searchParams,
}: Props) {
  const dottedName = decodeURIComponent(rawDottedName.join('/'))
  /*
  const decoded = utils.decodeRuleName(dottedName)

  */

  return (
    <Main>
      <ClientDocumentation
        dottedName={dottedName}
        searchParams={searchParams}
      />
    </Main>
  )
}
