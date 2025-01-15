import { formatValue } from '@/node_modules/publicodes/dist/index'
import {
  logFailingTest,
  throwIfFailingTest,
} from './dangerouslyDisactiveFailingTests'

export function personaTest(persona, nom, engine, dottedName, expectedValue) {
  const evaluation = engine.evaluate(dottedName),
    computedValue = evaluation.nodeValue,
    formattedValue = formatValue(evaluation, {
      precision: 0,
    })
  const correct =
    typeof expectedValue === 'number'
      ? Math.round(computedValue) === Math.round(expectedValue)
      : ['oui', 'non'].includes(expectedValue)
        ? expectedValue === formattedValue
        : typeof expectedValue === 'string'
          ? formattedValue === expectedValue
          : undefined

  if (correct === undefined)
    throw new Error('Failing test because of incorrect type recognition')
  if (correct === false) {
    if (logFailingTest) console.log('Failing persona', persona)
    if (throwIfFailingTest)
      throw new Error(
        `Failing test !! ${nom} ${persona.description},
                              computed: ${computedValue}, expected: ${expectedValue} for variable: ${dottedName}`,
      )
  }

  return { dottedName, correct, expectedValue, computedValue, formattedValue }
}
