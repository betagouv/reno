import { isMosaicQuestion } from '../BooleanMosaic'
import { sortBy } from '../utils'

export default function getNextQuestions(
  evaluation,
  answeredQuestions,
  questionsConfig,
  rules,
) {
  const { missingVariables } = evaluation

  const allMissingEntries = Object.entries(missingVariables),
    missingEntries = allMissingEntries
      .filter(([question]) => !answeredQuestions.includes(question))
      .filter(([question]) => {
        const mosaicQuestions = isMosaicQuestion(
          question,
          rules[question],
          rules,
        )

        if (!mosaicQuestions) return true

        if (
          answeredQuestions.find((q) =>
            mosaicQuestions.map(([k]) => k).includes(q),
          )
        )
          return false

        return true
      }),
    orderedEntries = sortBy(([k, v]) => v)(missingEntries).reverse(),
    firstEntry = orderedEntries[0],
    maxScore = firstEntry ? firstEntry[1] : 0,
    prio = questionsConfig.prioritaires || []

  const artificialOrdered = sortBy(([k, v]) =>
    prio.includes(k)
      ? maxScore + [...prio].reverse().findIndex((kk) => kk === k) + 1
      : v,
  )(orderedEntries).reverse()

  const nextQuestions = artificialOrdered.map(([k, v]) => k)

  return nextQuestions
}
