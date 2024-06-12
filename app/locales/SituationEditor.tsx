import { getRuleTitle, parentName } from '@/components/publicodes/utils'
import rules from '@/app/règles/rules'
import { sortBy } from '@/components/utils'

export default function ({ situationEntries, setSituationEntries }) {
  return (
    <ul>
      {sortBy(([dottedName]) => dottedName)(situationEntries).map(
        ([dottedName, value]) => {
          const nameSpace = getRuleTitle(dottedName, rules)
          return (
            <li
              key={dottedName}
              css={`
                display: flex;
                justify-content: space-between;
                max-width: 30rem;
              `}
            >
              <small>{nameSpace}</small>
              <input
                value={value}
                onChange={(e) =>
                  setSituationEntries(
                    situationEntries.map(([dottedName2, value2]) => [
                      dottedName2,
                      dottedName2 === dottedName ? e.target.value : value2,
                    ]),
                  )
                }
                css={`
                  max-width: 8rem;
                `}
              />
            </li>
          )
        },
      )}
    </ul>
  )
}
