import { sortBy } from '../utils'

export default function getNextQuestions(
  evaluation,
  answeredQuestions = [],
  questionsConfig = {},
) {
  const { missingVariables } = evaluation

  console.log('mv', missingVariables)

  const allMissingEntries = Object.entries(missingVariables),
    missingEntries = allMissingEntries.filter(
      ([question]) => !answeredQuestions.includes(question),
    ),
    orderedEntries = sortBy(([k, v]) => v)(missingEntries).reverse(),
    firstEntry = orderedEntries[0],
    maxScore = firstEntry ? firstEntry[1] : 0

  const { chapitres } = questionsConfig
  const orderedByChapter = !chapitres
    ? orderedEntries
    : sortBy(([dottedname]) => {
        const chapterIndex = chapitres.findIndex((chapitre) => {
          if (Array.isArray(chapitre)) {
            return chapitre.some((element) =>
              dottedname.startsWith(element + ' . '),
            )
          } else {
            return dottedname.startsWith(chapitre + ' . ')
          }
        })
        //        console.log('chapter', dottedname, chapterIndex)
        return chapterIndex === -1 ? Infinity : chapterIndex
      })(orderedEntries)

  console.log(
    'chapter',
    [...orderedByChapter].map(([k, v]) => k),
  )

  //TODO désactivé pour la v1 de RGA qui a plus besoin de catégories que d'ordre logique
  /*
  const prio = questionsConfig.prioritaires || []

  const artificialOrdered = [
    ...sortBy(([k, v]) =>
      prio.includes(k)
        ? maxScore + [...prio].reverse().findIndex((kk) => kk === k) + 1
        : v,
    )(orderedByChapter),
  ].reverse()
  */

  // Our "prioritaires" system would only retain questions that are included by publicodes in the missingVariables. Even if the model does not trigger question xyz, we may want manually trigger it in the config if it helps bypass other questions of the model, if these are more complex to anwser than e.g. using an API in the frontend to fill the questions.
  // It's easy in publicodes to make a variable depend on another (e.g. the department depend on a city question with "formule: city"), but this fails if the API question can be passed by the user : one rule should not depend on a formula referencing a question that can be "undefined" if the user passed it. Hence the following block of code
  // Handling this by inserting the "unecessary API question" in the "prioritaires" range of question is tricky, it could make some other questions pop by error
  // For simplicity, we hence introduce another yaml config attribut for questions that we want to be asked without considering what publicodes outputs as missingVariables
  const unansweredArtificialQuestions = (
    questionsConfig['préface'] || []
  ).filter((question) => !answeredQuestions.find((q) => q === question))

  const nextQuestions = [
    ...unansweredArtificialQuestions,
    ...orderedByChapter
      .map(([k, v]) => k)
      .filter((q) => !unansweredArtificialQuestions.includes(q)),
  ]

  console.log('chapter2', nextQuestions)
  return nextQuestions
}
