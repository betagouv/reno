import examplePersonas from './examplePersonas.yaml'
import rules from '@/app/règles/rules'

const getValues = (dottedName) => {
  const values = examplePersonas
    .map((persona) => persona.situation[dottedName])
    .filter(Boolean)

  const unique = new Set(values)
  return [...unique]
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
          margin: 0.1rem 0;
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
          li {
            margin: 0 0.4rem;
          }
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
            Ex. :{' '}
            <ul>
              {getValues(dottedName).map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </li>
        )
      })}
    </ul>
  )
}
