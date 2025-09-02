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

const engine = new Publicodes(rules)
async function apiResponse(method: string, request: Request) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries())
  const isTest = request.headers.get('referer')?.includes('api-doc')
  const token = params['token']
  const tokenList = process.env.API_TOKEN_LIST
    ? JSON.parse(process.env.API_TOKEN_LIST)
    : null

  try {
    logRequest(token, params['fields'], isTest)

    // Pour l'instant on ne contrôle pas les tokens le temps que la transition se fasse
    // if (!token && !isTest) {
    //   throw new Error(
    //     "Le paramètre token est manquant. N'hésitez pas à adresser une demande de token à l'adresse: contact@mesaidesreno.fr",
    //   )
    // }
    // if (!tokenList[token] && !isTest) {
    //   throw new Error(`Le token "${token}" est inconnu`)
    // }

    if (!params['fields']) {
      throw new Error(
        "Le paramètre fields dans l'url n'est pas précisé. Il permet d'évaluer une variable à partir d'une situation donnée. Vous pouvez trouver des exemples d'utilisation dans la documentation: https://mesaidesreno.beta.gouv.fr/api-doc",
      )
    }

    let rawSituation =
      method === 'POST' ? await request.json() : getSituation(params, rules)
    rawSituation = await handleCommuneData(rawSituation, 'ménage')
    rawSituation = await handleCommuneData(rawSituation, 'logement')
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
          rawValue: aide['evaluation'].nodeValue
            ? aide['evaluation'].nodeValue
            : null,
          // Les prêts et dispositifs d'exonérations se basent sur des taux et durées (plutôt que des montants)
          // des infos qui peuvent être utiles à retourner
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
          const baseRule =
            rules[
              decodeDottedName(field.replace(/\.MPR\.montant|\.montant/g, ''))
            ]
          acc[field] = {
            label: baseRule['titre'] ? baseRule['titre'] : baseRule['marque'],
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
                    label: rules[subAide.replace(' . montant', '')]['marque'],
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
    )}`
  }

  return undefined
}

export async function handleCommuneData(rawSituation, type) {
  try {
    // Vérifier si la variable est défini
    if (typeof rawSituation[type + ' . commune'] === 'undefined')
      return rawSituation

    // Vérifier si le code commune est un nombre (problème 06XXX -> 6XXX)
    if (typeof rawSituation[type + ' . commune'] === 'number') {
      throw new Error(
        'Le code INSEE ' +
          rawSituation[type + ' . commune'] +
          ' doit être entre guillement.',
      )
    }
    // Récupèrer les données de la commune
    const commune = await getCommune(rawSituation, type + ' . commune')

    // Vérifier si le code INSEE est valide
    if (rawSituation[type + ' . commune'] && !commune) {
      throw new Error(
        'Le code INSEE ' +
          rawSituation[type + ' . commune'] +
          " n'existe pas. Attention à ne pas confondre avec le code postal.",
      )
    }

    // Mettre à jour les données de la situation avec les informations de la commune
    if (commune) {
      rawSituation[type + ' . code région'] = `"${commune.codeRegion}"`
      rawSituation[type + ' . code département'] =
        `"${commune.codeDepartement}"`
      rawSituation[type + ' . EPCI'] = `"${commune.codeEpci}"`
    }
    return rawSituation
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des données de la commune:',
      error,
    )
    throw error
  }
}

async function logRequest(token, fields, isTest) {
  const matomoParams = new URLSearchParams({
    idsite: 101,
    rec: '1',
    e_c: 'API' + (isTest ? ' test' : ''),
    e_a: fields,
    e_n: token,
  })

  await fetch(
    `https://stats.beta.gouv.fr/matomo.php?${matomoParams.toString()}`,
  )
}
