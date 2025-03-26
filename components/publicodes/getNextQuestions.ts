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

  // Our "prioritaires" system would only retain questions that are included by publicodes in the missingVariables. Even if the model does not trigger question xyz, we may want manually trigger it in the config if it helps bypass other questions of the model, if these are more complex to anwser than e.g. using an API in the frontend to fill the questions.
  // It's easy in publicodes to make a variable depend on another (e.g. the department depend on a city question with "formule: city"), but this fails if the API question can be passed by the user : one rule should not depend on a formula referencing a question that can be "undefined" if the user passed it. Hence the following block of code
  const unansweredArtificialQuestions = prio.filter(
    (question) =>
      !allMissingEntries.find(([q]) => q === question) &&
      !answeredQuestions.find((q) => q === question),
  )

  console.log({ unansweredArtificialQuestions })

  const nextQuestions = [
    ...unansweredArtificialQuestions,
    ...artificialOrdered.map(([k, v]) => k),
  ]

  return nextQuestions
}
