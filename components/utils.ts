import iconIsolation from '@/public/isolation.svg'
import iconChauffage from '@/public/chauffage.svg'
import iconVentilation from '@/public/ventilation.svg'
import iconSolaire from '@/public/solaire.svg'
import AideMAR from './ampleur/AideMAR'
import AidesLocales from './ampleur/AidesLocales'
import CEEAmpleur from './ampleur/CEEAmpleur'
import Copro from './ampleur/Copro'
import Denormandie from './ampleur/Denormandie'
import EcoPTZ from './ampleur/EcoPTZ'
import MPRA from './ampleur/MPRA'
import PAR from './ampleur/PAR'
import TaxeFoncière from './ampleur/TaxeFoncière'

export const sortBy = (f) => (list) =>
  list.sort((a, b) => {
    const fa = f(a),
      fb = f(b)
    return fa < fb ? -1 : fa > fb ? 1 : 0
  })

export const capitalise0 = (s) => (s ? s[0].toUpperCase() + s.slice(1) : '')
export const uncapitalise0 = (s) => (s ? s[0].toLowerCase() + s.slice(1) : '')

export function omit(givenKeys, obj) {
  const keys = [...givenKeys]
  if (!keys.length) {
    return obj
  }
  const { [keys.pop()]: omitted, ...rest } = obj

  return omit(keys, rest)
}

export const transformObject = (transformer) => (obj) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => transformer(k, v)))

export const debounce = <F extends (...args: any[]) => void>(
  waitFor: number,
  fn: F,
) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), waitFor)
  }
}
export const roundToThousands = (value, thousands = 1) =>
  Math.round(value / (1000 * thousands)) * 1000 * thousands

export const categoriesGeste = [
  {
    code: 'isolation',
    titre: 'Isolation',
    icone: iconIsolation,
  },
  {
    code: 'solaire',
    titre: 'Solaire',
    icone: iconSolaire,
  },
  {
    code: 'chauffage',
    titre: 'Chauffage',
    icone: iconChauffage,
  },
  {
    code: 'ventilation',
    titre: 'Ventilation',
    icone: iconVentilation,
  },
]

export const correspondance = {
  'MPR . accompagnée': MPRA,
  'MPR . accompagnée . prise en charge MAR': AideMAR,
  PTZ: EcoPTZ,
  PAR: PAR,
  'aides locales': AidesLocales,
  'ampleur . prime individuelle copropriété': Copro,
  'taxe foncière': TaxeFoncière,
  denormandie: Denormandie,
  "CEE . rénovation d'ampleur": CEEAmpleur,
}