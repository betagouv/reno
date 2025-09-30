import { parse } from 'marked'

import PTZ from '@/app/règles/PTZ.publicodes'
import PAR from '@/app/règles/PAR.publicodes'
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
import CEE from '@/app/règles/CEE.publicodes'
import denormandie from '@/app/règles/denormandie.publicodes'
import taxeFoncière from '@/app/règles/taxe-foncière.publicodes'
import aidesLocales from '@/app/règles/aides-locales.publicodes'
import copropriete from '@/app/règles/copropriete.publicodes'
import mpa from '@/app/règles/ma-prime-adapt.publicodes'
import locavantage from '@/app/règles/locavantage.publicodes'
import MPRA from '@/app/règles/MPRA.publicodes'
import autresAides from '@/app/règles/autres-aides.publicodes'
import outreMer from '@/app/règles/outre-mer.publicodes'
import bonusGestesOutreMer from '@/app/règles/gestes/bonus-outre-mer.publicodes'

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
  ...prefix(PAC, 'gestes'),
  ...prefix(chauffage, 'gestes'),
  ...prefix(isolation, 'gestes'),
  ...prefix(bois, 'gestes'),
  ...prefix(réseau, 'gestes'),
  ...prefix(solaire, 'gestes'),
  ...prefix(aidesLocales, 'aides locales'),
  ...ampleur,
  ...MPRA,
  ...CEE,
  ...denormandie,
  ...taxeFoncière,
  ...PTZ,
  ...PAR,
  ...copropriete,
  ...mpa,
  ...locavantage,
  ...autresAides,
  ...outreMer,
  ...prefix(bonusGestesOutreMer, 'gestes'),
}

const rulesWithMarkdown = Object.fromEntries(
  Object.entries(rules).map(([k, v]) => [k, transformRuleObject(v)]),
)

export default rulesWithMarkdown

function transformRuleObject(v) {
  if (!v || !typeof v === 'object' || !v.description) return v

  const transformMarkdown = (text) => {
    if (!text) return undefined
    return parse(text)
  }

  const newV = {
    ...v,
    descriptionHtml: v.description && transformMarkdown(v.description),
    completeDescriptionHtml:
      v['description complète'] && transformMarkdown(v['description complète']),
    titreHtml: v.titre && transformMarkdown(v.titre),
    sousTitreHtml: v['sous-titre'] && transformMarkdown(v['sous-titre']),
    conditionsEligibilitesHTML:
      v['conditions éligibilités'] &&
      transformMarkdown(v['conditions éligibilités']),
    explicationHTML: v['explication'] && transformMarkdown(v['explication']),
    informationsUtilesHtml:
      v['informations utiles'] && transformMarkdown(v['informations utiles']),
    commentFaireHtml:
      v['comment faire'] && transformMarkdown(v['comment faire']),
  }
  return newV
}
