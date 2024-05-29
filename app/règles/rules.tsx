import { parse } from 'marked'

import ampleur from '@/app/règles/ampleur.yaml'
import gestes from '@/app/règles/gestes.yaml'
import chauffage from '@/app/règles/gestes/chauffage.yaml'
import réseau from '@/app/règles/gestes/chauffage/réseau.yaml'
import PAC from '@/app/règles/gestes/chauffage/PAC.yaml'
import bois from '@/app/règles/gestes/chauffage/bois.yaml'
import isolation from '@/app/règles/gestes/isolation.yaml'
import index from '@/app/règles/index.yaml'
import revenus from '@/app/règles/revenus.yaml'
import aidesLocales from '@/app/règles/aides-locales.yaml'
import CEE from '@/app/règles/CEE.yaml'

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
  ...prefix(réseau),
  ...prefix(PAC),
  ...prefix(bois),
  ...aidesLocales,
  ...ampleur,
  ...CEE,
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
