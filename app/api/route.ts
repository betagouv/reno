import {
  decodeDottedName,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import rules from '@/app/règles/rules'
import Publicodes, { formatValue } from 'publicodes'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import { omit } from '@/components/utils'

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

export async function POST(request: Request) {
  const body = await request.json()
  const fields = [Object.fromEntries(request.nextUrl.searchParams.entries())["fields"]]
  const situation = engine.setSituation(body)

  return Response.json(fields.reduce((acc, field) => {
    const evaluation = situation.evaluate(decodeDottedName(field))
      acc[field] = { 
        value: formatValue(evaluation),
        missingVariables: Object.keys(evaluation.missingVariables)
      }
      return acc;
    }, {})
  );
}
