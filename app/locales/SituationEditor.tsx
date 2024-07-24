'use client'
import rules from '@/app/règles/rules'
import { getRuleTitle } from '@/components/publicodes/utils'
import { sortBy } from '@/components/utils'

export default function ({ situation, setUserSituation }) {
  const situationEntries = Object.entries(situation)
  const sortedEntries = sortBy(([dottedName]) => dottedName)(situationEntries)
  return (
    <ul
      css={`
        list-style-type: none;
      `}
    >
      {sortedEntries.map(([dottedName, value]) => {
        const title = getRuleTitle(dottedName, rules)
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
              <small>{title}</small>

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
                  onChange={(e) => {
                    const { value } = e.target
                    setUserSituation((userSituation) => ({
                      ...userSituation,
                      [dottedName]: value,
                    }))
                  }}
                  css={`
                    max-width: 8rem;
                  `}
                />
              )}
            </label>
          </li>
        )
      })}
    </ul>
  )
}
