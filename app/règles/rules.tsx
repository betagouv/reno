import { parse } from 'marked'

import PTZ from '@/app/règles/PTZ.yaml'
import ampleur from '@/app/règles/ampleur.publicodes'
import gestes from '@/app/règles/gestes.yaml'
import chauffage from '@/app/règles/gestes/chauffage.yaml'
import réseau from '@/app/règles/gestes/chauffage/réseau.yaml'
import PAC from '@/app/règles/gestes/chauffage/PAC.yaml'
import bois from '@/app/règles/gestes/chauffage/bois.yaml'
import solaire from '@/app/règles/gestes/chauffage/solaire.yaml'
import isolation from '@/app/règles/gestes/isolation.yaml'
import index from '@/app/règles/index.yaml'
import revenus from '@/app/règles/revenus.yaml'
import CEE from '@/app/règles/CEE.yaml'
import denormandie from '@/app/règles/denormandie.yaml'
import taxeFoncière from '@/app/règles/taxe-foncière.yaml'
import aidesLocales from '@/app/règles/aides-locales.publicodes'
import copropriete from '@/app/règles/copropriete.publicodes'

/* TODO this doesn't work, investigate why, it should
 *
function requireAll(r) {
  r.keys().forEach(r)
}

const allYamls = requireAll(require.context('@/app/règles', true, /\.yaml$/))
console.log('allyamls', allYamls)
*/

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
  ...prefix(PAC, 'gestes'),
  ...prefix(bois, 'gestes'),
  ...prefix(réseau, 'gestes'),
  ...prefix(solaire, 'gestes'),
  ...prefix(aidesLocales, 'aides locales'),
  ...ampleur,
  ...CEE,
  ...denormandie,
  ...taxeFoncière,
  ...PTZ,
  ...copropriete,
}

const rulesWithMarkdown = Object.fromEntries(
  Object.entries(rules).map(([k, v]) => [k, transformRuleObject(v)]),
)

console.log('lightgreen rules', rules)
export default rulesWithMarkdown

function transformRuleObject(v) {
  if (!v || !typeof v === 'object' || !v.description) return v

  const newV = {
    ...v,
    descriptionHtml: v.description && parse(v.description),
    titreHtml: v.titre && parse(v.titre),
    sousTitreHtml: v['sous-titre'] && parse(v['sous-titre']),
    informationsUtilesHtml:
      v['informations utiles'] && parse(v['informations utiles']),
  }
  return newV
}
