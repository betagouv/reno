import remboursementIcon from '@/public/icon-remboursement.svg'
import pretIcon from '@/public/icon-pret.svg'
import avanceIcon from '@/public/icon-avance.svg'
import exonerationIcon from '@/public/icon-exoneration-fiscale.svg'
import isolationGeste from '@/public/isolation_geste.svg'
import ventilationGeste from '@/public/ventilation_geste.svg'
import chauffageGeste from '@/public/chauffage_geste.svg'
import solaireGeste from '@/public/solaire_geste.svg'

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

export const categories = [
  {
    code: 'isolation',
    titre: 'Isolation thermique',
    question: 'Quels problèmes constatez-vous ?',
    sousTitre: 'Murs, plancher, toit, portes et fenêtres',
    suffix: "d'isolation",
    image: isolationGeste,
    gestes: {
      'gestes . isolation . murs extérieurs,gestes . isolation . murs intérieurs':
        'Murs mal isolés ou froids au toucher',
      'gestes . isolation . rampants': 'Toiture ou combles mal isolés',
      'gestes . isolation . toitures terrasses':
        'Toit plat mal isolé, surchauffe en été',
      'gestes . isolation . plancher bas': 'Sensation de froid venant du sol',
      'gestes . isolation . vitres': 'Simple vitrage ou fenêtres anciennes',
    },
  },
  {
    code: 'ventilation',
    titre: 'Ventilation',
    question: 'Quelles options vous intéressent ?',
    sousTitre: 'VMC',
    image: ventilationGeste,
    gestes: {
      'gestes . ventilation . double flux': 'Ventilation double flux',
    },
  },
  {
    code: 'chauffage',
    titre: 'Chauffage',
    question: 'Quelles options vous intéressent ?',
    sousTitre: 'Pompe à chaleur, poêle, chauffe-eau...',
    suffix: 'de chauffage',
    image: chauffageGeste,
    gestes: {
      'gestes . chauffage . PAC': 'Pompe à chaleur',
      'gestes . chauffage . bois . chaudière': 'Chaudière',
      'gestes . chauffage . bois': 'Poêles et insert',
      'gestes . chauffage . chauffe-eau thermodynamique': 'Chauffe-eau',
      'gestes . chauffage . fioul . dépose cuve': 'Dépose de cuve à fioul',
    },
  },
  {
    code: 'solaire',
    titre: 'Solutions solaires',
    question: 'Quelles options vous intéressent ?',
    suffix: 'sur le solaire',
    image: solaireGeste,
    gestes: {
      'gestes . chauffage . PAC . solaire': 'Pompe à chaleur solarothermique',
      'gestes . chauffage . solaire . chauffe-eau solaire':
        'Chauffe-eau solaire',
      'gestes . chauffage . solaire . solaire combiné':
        'Chauffage solaire combiné',
      'gestes . chauffage . solaire . partie thermique PVT eau':
        "Partie thermique d'un équipement PVT eau",
    },
  },
  {
    code: 'autres',
    titre: 'Autres travaux',
    question: 'Quelles options vous intéressent ?',
    image: ventilationGeste,
    gestes: {
      'gestes . recommandés . audit': 'Audit énergétique',
    },
  },
]

export const getRulesByCategory = (
  rules: { [k: string]: any },
  type: string,
) => {
  const distinctRules = Object.keys(rules)
    .filter((item) => item.startsWith('gestes') && item.endsWith(type))
    .map((item) => (type == 'CEE' ? item : item.replace(' . ' + type, '')))
  const rulesByCategory = Object.fromEntries(
    categories.map((category) => [category.titre, []]),
  )

  if (type == 'CEE') {
    distinctRules.filter((item) => {
      const value = rules[item].code
      if (!distinctRules.find((item) => rules[item].code == value)) {
        distinctRules.push(item)
      }
    })
  }
  distinctRules.forEach((rule) => {
    const ruleCode = rules[rule]?.code
    for (const category of categories) {
      const catTitle = category.titre
      const catCode = category.code
      if (!rule.includes(catCode)) continue

      const ceeDuplicate =
        type === 'CEE' &&
        rulesByCategory[catTitle]?.some(
          (dottedName) => rules[dottedName]?.code === ruleCode,
        )

      if (ceeDuplicate) continue
      // Cas particulier du solaire qui contient souvent chauffage dans sa rule
      if (rule.includes('solaire') && catCode == 'chauffage') continue
      if (!rulesByCategory[catTitle]) {
        rulesByCategory[catTitle] = []
      }
      rulesByCategory[catTitle].push(rule)
    }
  })
  rulesByCategory['Autres travaux'].push('gestes . recommandés . audit')
  if (type == 'CEE') {
    delete rulesByCategory['Autres travaux']
  }
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
