import examplePersonas from './examplePersonas.yaml'
import rules from '@/app/règles/rules'

const getValues = (dottedName) => {
  const values = examplePersonas
    .map((persona) => persona.situation[dottedName])
    .filter(Boolean)

  const unique = new Set(values)
  return [...unique]
}

const schema = (dottedName) => {
  const rule = rules[dottedName]
  return rule['schema module']
}
export default function Schema({}) {
  const dottedNamesList = examplePersonas
    .map((persona) => Object.keys(persona.situation))
    .flat()
  const dottedNames = new Set(dottedNamesList)

  return (
    <ul
      css={`
        list-style-type: none;
        > li {
          margin: 0.4rem 0;
        }
        em {
          font-style: normal;
          padding: 0 0.3rem;
          border: 1px solid var(--lighterColor);
          background: var(--lightestColor);
          border-radius: 0.2rem;
        }
        ul {
          display: inline-flex;
          list-style-type: none;
          padding-left: 0.1rem;
          li {
            margin: 0 0.2rem;
          }
        }
      `}
    >
      {[...dottedNames].map((dottedName) => {
        const rule = rules[dottedName]
        const values = getValues(dottedName)
        return (
          <li key={dottedName}>
            <span>
              <em>{dottedName}</em>
            </span>{' '}
            <span>{schema(dottedName)}</span>
            <small>
              {' '}
              Exemples:
              <ul>
                {getValues(dottedName).map((value, i) => (
                  <li key={value}>
                    {value}
                    {i < values.length - 1 ? ', ' : '.'}
                  </li>
                ))}
              </ul>
            </small>
          </li>
        )
      })}
    </ul>
  )
}
