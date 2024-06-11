'use client'
import aides from '@/app/règles/aides-locales.yaml'
import FriendlyObjectViewer from '@/components/FriendlyObjectViewer'
import { getRuleTitle } from '@/components/publicodes/utils'
import { capitalise0, omit } from '@/components/utils'

const entries = Object.entries(aides)

const byPlace = entries.reduce(
  (memo, next) => {
    const dottedName = next[0]
    if (dottedName === '' || dottedName == '0') return memo

    const place = dottedName.split(' . ')[0]

    return { ...memo, [place]: [...(memo[place] || []), next] }
  },
  [{}],
)

export default function () {
  return (
    <ul
      css={`
        list-style-type: none;
      `}
    >
      {Object.entries(byPlace).map(
        ([place, rules]) =>
          place != 0 && (
            <li key={place} css={``}>
              <h2>{capitalise0(place)}</h2>

              <ul
                css={`
                  list-style-type: none;
                `}
              >
                {rules.map(([dottedName, rule]) => {
                  if (rule == null) return
                  if (typeof rule === 'string') return rule
                  return (
                    <li
                      key={dottedName}
                      css={`
                        margin: 0.6rem 0;
                      `}
                    >
                      {dottedName !== place && (
                        <div>{getRuleTitle(dottedName, aides)}</div>
                      )}
                      <div
                        css={`
                          > div {
                            border: 1px solid #aaa;
                            > ul {
                              padding-left: 0.6rem;
                              margin: 0.6rem 0;
                            }
                          }
                        `}
                      >
                        <FriendlyObjectViewer
                          {...{
                            data: omit(['titre'], rule),
                            options: {
                              keyStyle: `
									color: #41438a
									`,
                            },
                          }}
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </li>
          ),
      )}
    </ul>
  )
}
