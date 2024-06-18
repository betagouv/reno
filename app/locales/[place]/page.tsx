import FriendlyObjectViewer from '@/components/FriendlyObjectViewer'
import { Main, Section } from '@/components/UI'
import { getRuleTitle, parentName } from '@/components/publicodes/utils'
import { capitalise0, omit, sortBy } from '@/components/utils'

export default function LocalePlace({ params: { place: encodedPlace } }) {
  const place = decodeURIComponent(encodedPlace)
  return (
    <Main>
      <Section>
        <h1>Aides locales {capitalise0(place)}</h1>
        <p>Blabla</p>
      </Section>
      <ul
        css={`
          list-style-type: none;
        `}
      >
        {sortBy(
          ([dottedName]) =>
            dottedName == place || !dottedName.endsWith('montant'),
        )(rules).map(([dottedName, rule]) => {
          if (rule == null) return

          const evaluation = engine.evaluate('aides locales . ' + dottedName)
          const value = formatValue(evaluation)

          const isMontant = dottedName.endsWith('montant')

          return (
            <li
              key={dottedName}
              css={`
                margin: 0.6rem 0;
              `}
            >
              {dottedName !== place && (
                <div
                  css={`
                    display: flex;
                    justify-content: space-between;
                  `}
                >
                  <span
                    css={`
                      display: flex;
                      flex-direction: column;
                    `}
                  >
                    <small>
                      {parentName(dottedName).split(place + ' . ')[1]}
                    </small>
                    <h3
                      css={`
                        font-size: 100%;
                        margin: 0;
                        width: fit-content;
                        ${isMontant && `background: yellow`}
                      `}
                    >
                      {getRuleTitle(dottedName, aides)}
                    </h3>
                  </span>
                  <span>{value}</span>
                </div>
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
                {typeof rule === 'string' ? (
                  <div>{rule}</div>
                ) : (
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
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </Main>
  )
}
