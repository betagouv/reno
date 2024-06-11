import { parse } from 'marked'

import gestes from '@/app/règles/gestes.yaml'
import chauffage from '@/app/règles/gestes/chauffage.yaml'
import isolation from '@/app/règles/gestes/isolation.yaml'
import index from '@/app/règles/index.yaml'
import revenus from '@/app/règles/revenus.yaml'
import aidesLocales from '@/app/règles/aides-locales.yaml'

const prefix = (rules, prefix) =>
  Object.fromEntries(
    Object.entries(rules).map(([k, v]) => [
      k === '' ? prefix : prefix + ' . ' + k, // lets us create a root rule
      v,
    ]),
  )
const rules = {
  ...index,
  ...revenus,
  ...prefix(gestes, 'gestes'),
  ...prefix(chauffage, 'gestes'),
  ...prefix(isolation, 'gestes'),
  ...prefix(aidesLocales, 'aides locales'),
}

const rulesWithMarkdown = Object.fromEntries(
  Object.entries(rules).map(([k, v]) => [k, transformRuleObject(v)]),
)

console.log('imported non parsed rules')
export default rulesWithMarkdown

function transformRuleObject(v) {
  if (!v || !typeof v === 'object' || !v.description) return v

  const newV = {
    ...v,
    descriptionHtml: v.description && parse(v.description),
    titreHtml: v.titre && parse(v.titre),
    sousTitreHtml: v['sous-titre'] && parse(v['sous-titre']),
  }
  return newV
}
