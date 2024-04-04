import { parse } from 'marked'

import gestes from '@/app/règles/gestes.yaml'
import chauffage from '@/app/règles/gestes/chauffage.yaml'
import isolation from '@/app/règles/gestes/isolation.yaml'
import index from '@/app/règles/index.yaml'
import revenus from '@/app/règles/revenus.yaml'

const prefix = (rules) =>
  Object.fromEntries(
    Object.entries(rules).map(([k, v]) => ['gestes . ' + k, v]),
  )
const rules = {
  ...index,
  ...revenus,
  ...prefix(gestes),
  ...prefix(chauffage),
  ...prefix(isolation),
}

const rulesWithMarkdown = Object.fromEntries(
  Object.entries(rules).map(([k, v]) => [k, transformRuleObject(v)]),
)

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
