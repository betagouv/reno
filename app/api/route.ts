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
// const questionsConfig = { prioritaires: [], 'non prioritaires': [] }

// const targets = rules.aides.somme

// export async function GET(request: Request) {
//   const searchParams = request.nextUrl.searchParams
//   const searchParamsObject = Object.fromEntries(searchParams.entries())

//   const answeredQuestions = getAnsweredQuestions(searchParamsObject, rules)
//   const situation = getSituation(searchParamsObject, rules),
//     validatedSituation = Object.fromEntries(
//       Object.entries(situation).filter(([k, v]) =>
//         answeredQuestions.includes(k),
//       ),
//     )

//   engine.setSituation(validatedSituation)
//   const resultsArray = targets.map((target) => {
//     const evaluation = engine.evaluate(target),
//       value = formatValue(evaluation),
//       nextQuestions = getNextQuestions(
//         evaluation,
//         answeredQuestions,
//         questionsConfig,
//         rules,
//       )
//     return [target, { evaluation, value, nextQuestions }]
//   })

//   const results = Object.fromEntries(resultsArray)

//   return Response.json({
//     situation,
//     validatedSituation,
//     answeredQuestions,
//     results,
//   })
// }
async function apiResponse(method: string, request: Request) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries())

  const situation = method === "POST" ? 
    await request.json() : 
    getSituation(params, rules)

  let fields = params["fields"].split(',')
  const fullEvaluation = fields.includes("evaluation")

  engine.setSituation(situation)
  return Response.json(fields.filter((f) => f !== "evaluation").reduce((acc, field) => {
    const evaluation = engine.evaluate(decodeDottedName(field))
      acc[field] = { 
        rawValue: evaluation.nodeValue,
        formattedValue: formatValue(evaluation),
        missingVariables: Object.keys(evaluation.missingVariables)
      }
      if(fullEvaluation) {
        acc[field]["evaluation"] = evaluation
      }
      return acc;
    }, {})
  );
}

export async function GET(request: Request) {
  return apiResponse("GET", request)
}

export async function POST(request: Request) {
  return apiResponse("POST", request)
}
