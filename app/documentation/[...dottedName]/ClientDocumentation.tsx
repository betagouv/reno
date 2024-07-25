'use client'
import rules from '@/app/règles/rules'
import { getSituation } from '@/components/publicodes/situationUtils'
import { RulePage } from '@publicodes/react-ui'
import Link from 'next/link'
import Publicodes from 'publicodes'
import { parse } from 'marked'

const engine = new Publicodes(rules)

export default function ClientDocumentation({ dottedName, searchParams }) {
  const situation = getSituation(searchParams, rules)

  return (
    <RulePage
      engine={engine.setSituation(situation)}
      documentationPath="/documentation"
      rulePath={dottedName}
      renderers={{
        Link: ({ to, ...rest }) => (
          <Link href={to + '?' + new URLSearchParams(searchParams)} {...rest} />
        ),
        Text: ({ children }) => (
          <p
            dangerouslySetInnerHTML={{ __html: children && parse(children) }}
          />
        ),
      }}
    />
  )
}
