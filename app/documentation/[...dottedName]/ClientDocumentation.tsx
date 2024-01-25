'use client'
import { RulePage } from '@publicodes/react-ui'
import Link from 'next/link'
import rules from '@/app/règles/rules'
const engine = new Publicodes(rules)
import Publicodes, { utils } from 'publicodes'

export default function ClientDocumentation({ dottedName, searchParams }) {
  return (
    <RulePage
      engine={engine}
      documentationPath="/documentation"
      rulePath={dottedName}
      renderers={{
        Link: ({ to, ...rest }) => (
          <Link href={to + '?' + new URLSearchParams(searchParams)} {...rest} />
        ),
      }}
    />
  )
}
