import examplePersonas from './examplePersonas.yaml'
import examplePersonasPlusValue from './plus-value/examplePersonasValeurVerte.yaml'
import exampleDpe from '@/components/dpe/exampleDpe.yaml'
import rules from '@/app/règles/rules'

const getValues = (dottedName, moduleName) => {
  const values = getPersonas(moduleName)
    .map((persona) => persona.situation[dottedName])
    .filter(Boolean)

  const unique = new Set(values)
  return [...unique]
}

const schema = (dottedName) => {
  const rule = rules[dottedName]
  return rule && rule['schema module'] ? rule['schema module'] : ''
}
export const getPersonas = (moduleName) =>
  moduleName == 'ampleur'
    ? examplePersonas
    : moduleName == 'plus-value'
      ? examplePersonasPlusValue
      : exampleDpe

export default function Schema({ moduleName }) {
  const dottedNames = new Set(
    getPersonas(moduleName)
      .map((persona) => Object.keys(persona.situation))
      .flat(),
  )

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
        const values = getValues(dottedName, moduleName)
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
                {values.map((value, i) => (
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
