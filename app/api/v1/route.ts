import {
  decodeDottedName,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import rules from '@/app/règles/rules'
import Publicodes, { formatValue } from 'publicodes'
import { useAides } from '@/components/ampleur/useAides'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import { omit } from '@/components/utils'
import enrichSituation from '@/components/personas/enrichSituation'

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
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries())

    // On récupére l'éligibilité de la commune à Denormandie et exonération taxe foncière
    // Pour ne pas demander ses variables lors de l'appel API
    const situation = await enrichSituation(
      method === 'POST' ? await request.json() : getSituation(params, rules),
    )

    let fields = params['fields'].split(',')
    const fullEvaluation = fields.includes('evaluation')

    let response
    if (fields == 'eligibilite') {
      const aides = useAides(engine, situation)
      response = aides
        .filter((aide) => aide['baseDottedName'] != 'aides locales')
        .map((aide) => ({
          label:
            aide['marque'] +
            (aide['complément de marque']
              ? ' ' + aide['complément de marque']
              : ''),
          fields: aide['baseDottedName'],
          type: aide['type'],
          status: aide['status'],
          value: aide['value'],
          taux:
            aide['baseDottedName'] == 'taxe foncière'
              ? situation['taxe foncière . commune . taux']
              : aide['baseDottedName'] == 'denormandie'
                ? formatValue(
                    engine
                      .setSituation(situation)
                      .evaluate('denormandie . taux'),
                  )
                : undefined,
          durée:
            aide['baseDottedName'] == 'taxe foncière'
              ? rules['taxe foncière . durée'] + 's'
              : aide['baseDottedName'] == 'denormandie'
                ? formatValue(
                    engine
                      .setSituation(situation)
                      .evaluate('denormandie . durée'),
                  ) + ' ans'
                : undefined,
          missingVariables: Object.keys(aide['evaluation']['missingVariables']),
        }))
    } else {
      response = fields
        .filter((f) => f !== 'evaluation')
        .reduce((acc, field) => {
          const evaluation = engine
            .setSituation(situation)
            .evaluate(decodeDottedName(field))
          acc[field] = {
            rawValue: evaluation.nodeValue,
            formattedValue: formatValue(evaluation),
            missingVariables: Object.keys(evaluation.missingVariables),
          }

          if (field.startsWith('gestes')) {
            // On détaille dans une variable le calcul (MPR+(CP ou CEE))
            acc[field]['details'] = rules[decodeDottedName(field)]['somme'].map(
              (subAide) => {
                const subEvaluation = engine.evaluate(
                  decodeDottedName(field).replace('montant', subAide),
                )
                return {
                  [subAide.replace(' . montant', '')]: {
                    rawValue: subEvaluation.nodeValue,
                    formattedValue: formatValue(subEvaluation),
                    missingVariables: Object.keys(
                      subEvaluation.missingVariables,
                    ),
                  },
                }
              },
            )
          }

          if (fullEvaluation) {
            acc[field]['evaluation'] = evaluation
          }
          return acc
        }, {})
    }

    return Response.json(response)
  } catch (error) {
    return Response.json({ error: error }, { status: 500 })
  }
}

export async function GET(request: Request) {
  return apiResponse('GET', request)
}

export async function POST(request: Request) {
  return apiResponse('POST', request)
}
