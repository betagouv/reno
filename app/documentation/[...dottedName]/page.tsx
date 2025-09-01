import ClientDocumentation from './ClientDocumentation'
import rules from '@/app/règles/rules'
import { getRuleTitle } from '@/components/publicodes/utils'
import { Marked } from 'marked'
import markedPlaintify from 'marked-plaintify'
import { utils } from 'publicodes'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import { PageBlock } from '@/components/UI'

const parser = new Marked({ gfm: true }).use(markedPlaintify())
const markdownToPlainText = (markdown) => parser.parse(markdown)

export async function generateMetadata(props): Promise<Metadata> {
  const { dottedName: rawDottedName } = await props.params
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

export default async function RuleDocumentation(props) {
  const { dottedName: rawDottedName } = await props.params
  const searchParams = await props.searchParams
  const dottedName = decodeURIComponent(rawDottedName.join('/'))

  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <ClientDocumentation
          dottedName={dottedName}
          searchParams={searchParams}
        />
      </PageBlock>
    </>
  )
}
