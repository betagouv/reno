import { testPublicodesStringContent } from '@/components/publicodes/situationUtils'

/* D'une version à l'autre, nous faisons évoluer le modèle.
 * En 2024, les valeurs possibles pour la période de construction du logement évoluent.
 * Pour que le modèle reste le plus simple possible et adapté à la période en cours, nous ne gardons pas les anciennes valeurs.
 *
 * Cette fonction, appelée par getSituation de situationUtils, permet de faire les migrations pour maintenir au mieux
 * la compatibilité des anciennes URL (ou appels d'API) avec le nouveau modèle à jour.
 * */
export default function migrate(situation) {
  const entries = Object.entries(situation)

  const newEntries = entries
    .map(([k, v]) => {
      if (k === 'logement . période de construction') {
        console.log('migration', k, v)
        if (testPublicodesStringContent(v, 'au moins 25 ans'))
          return [k, "'au moins 15 ans'"]
        if (testPublicodesStringContent(v, 'de 15 à 25 ans'))
          return [k, "'au moins 15 ans'"]
        if (testPublicodesStringContent(v, 'de 2 à 15 ans')) return undefined
      }
      return [k, v]
    })
    .filter(Boolean)

  return Object.fromEntries(newEntries)
}

// TODO
//
// En fonction des prochaines évolutions nécessaires, peut-être adopter un schéma de migration ?
// Par exemple :
/*
- nom: logement . période de construction
  ancienne valeur: "'au moins 25 ans'"
  nouvelle valeur: "'au moins 15 ans'"

- nom: logement . période de construction
  ancienne valeur: "'de 15 à 25 ans'"
  nouvelle valeur: "'au moins 15 ans'"

- nom: logement . période de construction
  ancienne valeur: "'de 2 à 15 ans'"
  nouvelle valeur: 
*/
