import rules from '@/app/règles/rules'

export default function Schema({ examplePersonas }) {
  const dottedNamesList = examplePersonas
    .map((persona) => Object.keys(persona.situation))
    .flat()
  const dottedNames = new Set(dottedNamesList)

  return (
    <ul
      css={`
        list-style-type: none;
        li {
          margin: 0.1rem 0;
        }
        em {
          font-style: normal;
          padding: 0 0.3rem;
          border: 1px solid var(--lighterColor);
          background: var(--lightestColor);
          border-radius: 0.2rem;
        }
      `}
    >
      {[...dottedNames].map((dottedName) => {
        const rule = rules[dottedName]
        return (
          <li key={dottedName}>
            <span>
              <em>{dottedName}</em>
            </span>{' '}
            Exemples :{' '}
            <span>
              {examplePersonas
                .map((persona) => persona.situation[dottedName])
                .filter(Boolean)
                .join(', ')}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
