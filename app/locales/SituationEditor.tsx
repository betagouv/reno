import { getRuleTitle, parentName } from '@/components/publicodes/utils'
import rules from '@/app/règles/rules'
import { sortBy } from '@/components/utils'
import { userAgentFromString } from 'next/server'

export default function ({ situation, setUserSituation }) {
  const situationEntries = Object.entries(situation)
  return (
    <ul
      css={`
        list-style-type: none;
      `}
    >
      {sortBy(([dottedName]) => dottedName)(situationEntries).map(
        ([dottedName, value]) => {
          const nameSpace = getRuleTitle(dottedName, rules)
          return (
            <li
              key={dottedName}
              css={`
                max-width: 30rem;
                margin-bottom: 0.6rem;
                input {
                  text-align: right;
                  padding: 0 0.2rem;
                }
                label {
                  display: flex;
                  justify-content: space-between;
                  small {
                    margin-right: 2rem;
                  }
                }
              `}
            >
              <label>
                <small>{nameSpace}</small>

                {['oui', 'non'].includes(value) ? (
                  <input
                    css={`
                      height: 1.2rem !important;
                      width: 1.2rem !important;
                    `}
                    type="checkbox"
                    checked={value === 'oui'}
                    onChange={() =>
                      setUserSituation((userSituation) => ({
                        ...userSituation,
                        [dottedName]: value === 'oui' ? 'non' : 'oui',
                      }))
                    }
                  />
                ) : (
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
                )}
              </label>
            </li>
          )
        },
      )}
    </ul>
  )
}
