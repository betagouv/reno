import { SuggestionsList } from '@/components/InputUI'
import Link from 'next/link'

export default function Suggestions({ rule, onClick }) {
  if (!rule.suggestions) return null

  const suggestions = Object.entries(rule.suggestions)
  // TODO should be evaluated by the engine

  const getValue = (v) => {
    const unitSplit = ('' + v).split(' ')
    if (!isNaN(unitSplit[0])) return unitSplit[0]
    return v
  }

  return (
    <SuggestionsList>
      {suggestions.map(([k, v]) => (
        <li key={k}>
          <Link href={onClick(getValue(v))}>{k}</Link>
        </li>
      ))}
    </SuggestionsList>
  )
}
