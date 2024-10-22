import { buildEligilityObject } from '@/app/api/communes/route'
import { extractCleanCodeInsee } from './enrichSituation'

export default function enrichSituationServer(situation) {
  const codeInsee = extractCleanCodeInsee(situation)

  const éligibilité = buildEligilityObject(codeInsee)
  return { ...situation, ...éligibilité }
}
