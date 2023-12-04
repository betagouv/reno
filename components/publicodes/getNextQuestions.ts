import { sortBy } from '../utils'

export default function getNextQuestions(
  evaluation,
  answeredQuestions,
  questionsConfig,
) {
  const { missingVariables } = evaluation

  const allMissingEntries = Object.entries(missingVariables),
    missingEntries = allMissingEntries.filter(
      ([question]) => !answeredQuestions.includes(question),
    ),
    orderedEntries = sortBy(([k, v]) => v)(missingEntries).reverse(),
    firstEntry = orderedEntries[0],
    maxScore = firstEntry ? [1] : 0,
    prio = questionsConfig.prioritaires || [],
    artificialOrdered = sortBy(([k, v]) =>
      prio.includes(k)
        ? maxScore + [...prio].reverse().findIndex((kk) => kk === k) + 1
        : v,
    )(orderedEntries).reverse()

  const nextQuestions = artificialOrdered.map(([k, v]) => k)

  return nextQuestions
}
