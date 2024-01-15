import index from './règles/index.yaml'
import revenus from './règles/revenus.yaml'
import gestes from './règles/gestes.yaml'
import isolation from './règles/gestes/isolation.yaml'
import chauffage from './règles/gestes/chauffage.yaml'

import { micromark } from 'micromark'

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
    descriptionHtml: micromark(v.description),
  }
  return newV
}
