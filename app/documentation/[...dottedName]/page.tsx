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

  const situation = getSituation(searchParams, rules)
  */

  return (
    <Main>
      <Section>
        <ClientDocumentation
          dottedName={dottedName}
          searchParams={searchParams}
        />
      </Section>
    </Main>
  )
}
