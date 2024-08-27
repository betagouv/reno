import { getSituation } from '@/components/publicodes/situationUtils'
import { Main, Section } from '@/components/UI'
import ClientDocumentation from './ClientDocumentation'
import rules from '@/app/règles/rules'
import { getRuleTitle } from '@/components/publicodes/utils'
import { Marked } from 'marked'
import markedPlaintify from 'marked-plaintify'
import { utils } from 'publicodes'

const parser = new Marked({ gfm: true }).use(markedPlaintify())
const markdownToPlainText = (markdown) => parser.parse(markdown)

export function generateMetadata(
  { params: { dottedName: rawDottedName }, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const decoded = decodeURIComponent(rawDottedName.join('/'))
  const dottedName = utils.decodeRuleName(decoded)

  const rule = rules[dottedName]
  const { description: rawDescription } = rule ?? {}

  const title = getRuleTitle(dottedName, rules)

  let description

  try {
    if (rawDescription != null)
      description = markdownToPlainText(rawDescription)
  } catch (e) {
    console.log(e)
  }

  return {
    title,
    description,
    alternates: {
      canonical: `/documentation/${rawDottedName.join('/')}`,
    },
  }
}

export default function RuleDocumentation({
  params: { dottedName: rawDottedName },
  searchParams,
}: Props) {
  const dottedName = decodeURIComponent(rawDottedName.join('/'))

  return (
    <Main>
      <ClientDocumentation
        dottedName={dottedName}
        searchParams={searchParams}
      />
    </Main>
  )
}
