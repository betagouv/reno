import {
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import rules from '@/app/règles/rules'
import Publicodes, { formatValue } from 'publicodes'
import getNextQuestions from '@/components/publicodes/getNextQuestions'

const engine = new Publicodes(rules)
const questionsConfig = { prioritaires: [], 'non prioritaires': [] }

const targets = rules.aides.somme
export async function GET(request: Request) {
  const searchParams = request.nextUrl.searchParams
  const searchParamsObject = Object.fromEntries(searchParams.entries())

  const answeredQuestions = getAnsweredQuestions(searchParamsObject, rules)
  const situation = getSituation(searchParamsObject, rules),
    validatedSituation = Object.fromEntries(
      Object.entries(situation).filter(([k, v]) =>
        answeredQuestions.includes(k),
      ),
    )

  engine.setSituation(validatedSituation)
  const resultsArray = targets.map((target) => {
    const evaluation = engine.evaluate(target),
      value = formatValue(evaluation),
      nextQuestions = getNextQuestions(
        evaluation,
        answeredQuestions,
        questionsConfig,
        rules,
      )
    return [target, { evaluation, value, nextQuestions }]
  })

  const results = Object.fromEntries(resultsArray)

  return Response.json({
    situation,
    validatedSituation,
    answeredQuestions,
    results,
  })
}
