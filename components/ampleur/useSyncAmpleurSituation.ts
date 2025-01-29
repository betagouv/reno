import { situationToCtaUrl } from '@/app/module/AmpleurCTA'
import { userInputDottedNames } from '@/app/module/AmpleurInputs'
import { useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'
/*
 * Nous avons besoin de stocker les données saisies par l'utilisateur pendant l'utilisation du module ampleur.
 * Car en zappant d'annonce en annonce, il va dans l'écrasante majorité des cas vouloir réutiliser les mêmes données concernant son profil à lui : les 6 points de données collectées par le module ampleur (raison de l'achat (3 points), personnes et revenu du foyer, IdF ou pas).
 * Ainsi, on va stocker ses valeurs avec un "*", comme dans le simulateur principal.
 *
 * Donc dans Ampleur.tsx, on a besoin d'aller chercher ces valeurs dans le localstorage à l'initialisation.
 *
 * Mais ce qui rend la chose compliquée c'est qu'on peut aussi avoir déjà ces valeurs via l'utilisation au préalable de Mes Aides Réno via useSyncUrlLocalStorage.
 *
 * Dans ce cas, l'utilisateur n'a rien besoin de faire, si ce n'est de corriger les valeurs par exemple dans le cas d'un ordinateur partagé.
 *
 * Idem dans le cas où l'utilisateur découvre MAR sur une anonnce, remplit les 6 points ampleur puis lance le parcours complet qui inclut des questions sur le logement en question. Le module ampleur ne doit retenir que les 6 points, mais au clic sur le CTA de simulation, il doit alors utiliser les valeurs propres au logement injectées potentiellement par l'agence pour lui éviter de remplir à la main par exemple la surface alors qu'elle est renseignée dans l'annonce.
 *
 * Tester ça.
 *
 *
 * */

export default function useSyncAmpleurSituation(answeredSituation) {
  const [savedSituation, setSavedSituation] = useLocalStorage(
    'ampleurSituation',
    null,
  )
  // On stocke dans le local storage les variables de l'utilisateur, pas de son logement ou projet
  const userSituation = Object.fromEntries(
    Object.entries(answeredSituation).filter(([dottedName]) =>
      userInputDottedNames.includes(dottedName),
    ),
  )

  const answeredSituationHash = JSON.stringify(userSituation)
  useEffect(() => {
    if (Object.keys(answeredSituation).length === 0) return

    // on ne fait qu'ajouter des variables au local storage, ce qui évite d'écraser d'emblée celles stockées à l'origine
    setSavedSituation({ ...savedSituation, ...answeredSituation })
  }, [answeredSituationHash, setSavedSituation])

  return savedSituation
}
