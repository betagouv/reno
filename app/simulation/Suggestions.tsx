import { SuggestionsList } from '@/components/InputUI'
import { Tag } from '@codegouvfr/react-dsfr/Tag'
import { useState } from 'react'

export default function Suggestions({ rule, onClick }) {
  const [pressedTag, setPressedTag] = useState(null)
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
          <Tag
            nativeButtonProps={{
              onClick: function handleClick() {
                setPressedTag(k)
                onClick(getValue(v))
              },
            }}
            pressed={pressedTag === k}
          >
            {k}
          </Tag>
        </li>
      ))}
    </SuggestionsList>
  )
}
