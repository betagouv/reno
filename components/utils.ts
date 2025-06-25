import iconIsolation from '@/public/isolation.svg'
import iconChauffage from '@/public/chauffage.svg'
import iconVentilation from '@/public/ventilation.svg'
import iconSolaire from '@/public/solaire.svg'
import remboursementIcon from '@/public/icon-remboursement.svg'
import pretIcon from '@/public/icon-pret.svg'
import avanceIcon from '@/public/icon-avance.svg'
import exonerationIcon from '@/public/icon-exoneration-fiscale.svg'

export const formatNumberWithSpaces = (num) => {
  return num
    .toString()
    .replace(/\D/g, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

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

export const getRulesByCategory = (rules: { [k: string]: any }) => {
  const distinctRulesMPR = Object.keys(rules)

    .filter((item) => item.startsWith('gestes') && item.endsWith('MPR'))
    .map((item) => item.replace(' . MPR', ''))

  const rulesByCategory = Object.fromEntries(
    categoriesGeste.map((category) => [category.titre, []]),
  )
  distinctRulesMPR.forEach((rule) => {
    for (const category of categoriesGeste) {
      if (rule.includes(category.code)) {
        rulesByCategory[category.titre].push(rule)
        break
      }
    }
  })
  return rulesByCategory
}

export const aideStyles = {
  prêt: {
    color: '#79A5DB',
    backgroundColor: '#CDE4FF',
    borderColor: '#79A5DB',
    icon: pretIcon,
  },
  'exonération fiscale': {
    color: '#CD9C5D',
    backgroundColor: '#FFE9CD',
    borderColor: '#CD9C5D',
    icon: exonerationIcon,
  },
  remboursement: {
    color: '#8484D0',
    backgroundColor: '#E3E3FD',
    borderColor: '#8484D0',
    icon: remboursementIcon,
  },
  avance: {
    color: '#97AA7A',
    backgroundColor: '#FDF8DB',
    borderColor: '#97AA7A',
    icon: avanceIcon,
  },
}
