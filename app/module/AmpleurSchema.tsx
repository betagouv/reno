import examplePersonas from './examplePersonas.yaml'
import examplePersonasPlusValue from './plus-value/examplePersonasValeurVerte.yaml'
import exampleDpe from '@/components/dpe/exampleDpe.yaml'
import rules from '@/app/règles/rules'
import Accordion from '@codegouvfr/react-dsfr/Accordion'

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
    <div className="accordion-group fr-mb-5v">
      {[...dottedNames].map((dottedName) => {
        const values = getValues(dottedName, moduleName)
        return (
          <Accordion key={dottedName} label={dottedName}>
            <p>{schema(dottedName)}</p>
            Exemples:
            <ul>
              {values.map((value, i) => (
                <li key={value}>
                  {value}
                  {i < values.length - 1 ? ', ' : '.'}
                </li>
              ))}
            </ul>
          </Accordion>
        )
      })}
    </div>
  )
}
