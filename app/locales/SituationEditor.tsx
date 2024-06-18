import { getRuleTitle, parentName } from '@/components/publicodes/utils'
import rules from '@/app/règles/rules'
import { sortBy } from '@/components/utils'
import { userAgentFromString } from 'next/server'

export default function ({ situation, setUserSituation }) {
  const situationEntries = Object.entries(situation)
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
                input {
                  text-align: right;
                  padding: 0 0.2rem;
                }
              `}
            >
              <small>{nameSpace}</small>
              <input
                value={value}
                onChange={(e) =>
                  setUserSituation((userSituation) => ({
                    ...userSituation,
                    [dottedName]: e.target.value,
                  }))
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
