import { SuggestionsList } from '@/components/InputUI'
import Link from 'next/link'

export default function Suggestions({ rule, onClick }) {
  const suggestions = Object.entries(rule.suggestions)
  // TODO should be evaluated by the engine

  const getValue = (v) => v.split(' ')[0]

  return (
    <SuggestionsList>
      {suggestions.map(([k, v]) => (
        <li key={k}>
          <Link href={onClick(getValue(v))}>{v}</Link>
        </li>
      ))}
    </SuggestionsList>
  )
}
