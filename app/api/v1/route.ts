import {
  decodeDottedName,
  getSituation,
} from '@/components/publicodes/situationUtils'
import rules from '@/app/règles/rules'
import Publicodes, { formatValue } from 'publicodes'
import { useAides } from '@/components/ampleur/useAides'
import enrichSituation, {
  getCommune,
} from '@/components/personas/enrichSituation'

function getTaux(
  baseDottedName: string,
  situation: any,
  engine: Publicodes,
): string | undefined {
  let dottedName = baseDottedName.replace('.montant', '')
  if (['taxe foncière'].includes(dottedName)) {
    return situation['taxe foncière . commune . taux']
  }
  if (['denormandie', 'PTZ', 'PAR'].includes(dottedName)) {
    return formatValue(
      engine.setSituation(situation).evaluate(dottedName + ' . taux'),
    )
  }
  return undefined
}

function getDuree(
  baseDottedName: string,
  situation: any,
  engine: Publicodes,
): string | undefined {
  let dottedName = baseDottedName
    .replace(' . montant', '')
    .replace('.montant', '')
  if (['PTZ', 'PAR', 'denormandie', 'taxe foncière'].includes(dottedName)) {
    return `${formatValue(
      engine.setSituation(situation).evaluate(dottedName + ' . durée'),
    )}s`
  }

  return undefined
}

const engine = new Publicodes(rules)
async function apiResponse(method: string, request: Request) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries())
    const matomoParams = new URLSearchParams({
      idsite: 101,
      rec: '1',
      e_c: 'API',
      e_a: params['fields'],
    })
    await fetch(`https://stats.beta.gouv.fr?${matomoParams.toString()}`)
    const rawSituation =
      method === 'POST' ? await request.json() : getSituation(params, rules)

    // On récupère code région/code département pour déterminer le barème MPR et les zones H1,H2,H3 des CEE

    if (typeof rawSituation['ménage . commune'] === 'number') {
      // L'utilisateur a surement oublié les guillemets, on transforme en string
      rawSituation['ménage . commune'] =
        rawSituation['ménage . commune'].toString()
    }
    const commune = await getCommune(rawSituation, 'ménage . commune')
    if (rawSituation['ménage . commune'] && !commune) {
      throw new Error(
        'Le code INSEE ' +
          rawSituation['ménage . commune'] +
          " n'existe pas. Attention à ne pas confondre avec le code postal.",
      )
    }
    if (commune) {
      rawSituation['ménage . code région'] = `"${commune.codeRegion}"`
      rawSituation['ménage . code département'] = `"${commune.codeDepartement}"`
      rawSituation['ménage . EPCI'] = `"${commune.codeEpci}"`
    }

    // De même, on récupère automatiquement l'éligibilité de la commune à Denormandie et exonération taxe foncière
    // Pour ne pas demander ses variables lors de l'appel API
    const situation = await enrichSituation(rawSituation)

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
          taux: getTaux(aide['baseDottedName'], situation, engine),
          durée: getDuree(aide['baseDottedName'], situation, engine),
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
            taux: getTaux(field, situation, engine),
            durée: getDuree(field, situation, engine),
            missingVariables: Object.keys(evaluation.missingVariables),
          }
          if (
            field.startsWith('gestes') &&
            !(field.includes('MPR') || field.includes('CEE'))
          ) {
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
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  return apiResponse('GET', request)
}

export async function POST(request: Request) {
  return apiResponse('POST', request)
}
