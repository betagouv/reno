# Notes de version du modèle

## À propos

### Versionage sémantique

À chaque changement du modèle, si le changement est cassant, nous publions une nouvelle version majeure (2.1.2 -> 3.0.0) pour signaler le changement cassant. Par exemple, une variable d'entrée renommée.

> MAJOR version when you make incompatible API changes

À l'inverse si c'est par exemple une amélioration substantielle du calcul, une nouvelle aide, ou juste la documentation d'une variable qui est améliorée, c'est un changement mineur (2.1.2 -> 2.1.3).

> MINOR version when you add functionality in a backward compatible manner

Si c'est une correction de bug sans incidence sur les réintégrateurs, c'est une version dite patch.

> PATCH version when you make backward compatible bug fixes

À noter, tant que nous n'avons pas atteint la version 1, le versionage sémantique est décalé vers la droite d'une décimale : passer de 0.4.1 à 0.5.0 représente un changement cassant !

### Externalisation du modèle ?

Dans un premier temps, je pense que nous devons garder le modèle et le code JS sur le même dépot, et les versions sont unifiées : on y met les changement de l'interface comme du modèle.

Dans un second temps, nous pourrons imaginer découpler les deux.

On pourra publier paquet NPM à chaque changement de version qui expose le modèle publicodes. On peut aussi inscrire dans l'URL de l'API exposée par `/api/routes.ts` le numéro de version.

Et prendre les demandes de nos réintégrateurs au fur et à mesure.

## Versions

### v2.3.1

:bug: Nous avons corrigé un bug important dans le modèle de calcul de la catégorie MaPrimeRénov.

Nous pensions que le choix du barème (Île-de-France ou hors Île-de-France) à appliquer pour déterminer la catégorie de revenu MaPrimeRénov' (très modeste, modeste, intermédiaire ou aisé) était déterminé en fonction de l'adresse de la résidence principale du propriétaire.

Or, ce n'est le cas que pour les propriétaires bailleurs, pour les propriétaires occupants, c'est l'adresse du logement rénové qu'il faut prendre en compte dans le calcul. D'une certaine manière, le législateur se projette dans la future résidence principale pour déterminer l'éligibilité aux différents montants d'aide.

Concrètement, cela signifie qu'il faut maintenant renseigner "logement . commune" plutôt que "ménage . commune" pour les propriétaires occupants.

Voir [les changements](https://github.com/betagouv/reno/pull/377).

### v2.2.0

:bug: Nous avons corrigé un bug important dans le modèle de calcul copropriété.

Nous pensions que le plafond s'appliquait à la subvention, or il s'applique à l'assiette, c'est-à-dire au montant des travaux. C'est un cas classique de confusion qui intervient à chaque fois qu'un plafond s'applique : il faut être complètement explicite sur le sujet du plafond.

Voir [les changements](https://github.com/betagouv/reno/pull/372).

### v2.1.0

Nous avons acté la sortie de beta après plusieurs mois d'utilisation.

### v2.0.0-beta4

#### Nouveau design pour le module Parcours Accompagné, pour une rénovation d'ampleur

Le module ampleur passe en version 3. Ses évolutions sont décrites en bas de la [page dédiée](https://mesaidesreno.beta.gouv.fr/module).

Une nouvelle variable est introduite dans le module pour passer de l'année de construction du logement à l'une des quelques périodes de construction utilisées par les aides à la rénovation.

Elle n'est pour l'instant pas utilisée pour pouvoir injecter dans le modèle l'année de construction.

#### Nouvelle API et documentation plus complète

Sur la page [api-doc](https://mesaidesreno.beta.gouv.fr/api-doc), on expose une nouvelle route "Éligibilité" qui permet de calculer toutes les aides d'ampleur. D'autres aides sont ensuites ajoutées individuellement.

La liste des paramètres fait également son apparition. Ce sont les questions à poser à vos utilisateurs.

### v2.0.0-beta3

Nous passons à la version 2 de Mes Aides Réno pour 2025 : en effet, des changements 💥 **cassants** sont à prévoir.

En particulier, le changement de nomenclature de la période de construction du logement.

Cette nomenclature sert à éviter de connaitre la date de construction précise du logement. Auparavant, pour la taxe foncière, nous avions introduit la période "plus de 25 ans". Elle est maintenant caduque en 2025, remplacée par un "plus de 10 ans".

De nombreux autres changements interviennent en 2025, concernant les taux MaPrimeRénov' parcours accompagné, les taux d'écrêtement, certains montants d'aide pour le parcours par geste.

Veuillez consulter le détail des changements dans la [PR 2025](https://github.com/betagouv/reno/pull/305).

Note : certains éléments sont toujours incertains en cette fin décembre 2025, attendez-vous à des version de correction dans les semaines qui viennent.

### v1.0.0-beta3

Nous avons pris en compte les premiers retours critiques. En particulier, un changement important pour le modèle : la subvention de l'État pour l'Accompagnateur Rénov' a son _assiette_ plafonnée, et pas son _résultat_. Nous nous étions basés sur la description ambigue de cette aide sur les supports officiels, qui parlaient par erreur d'une _subvention plafonnée_. C'est corrigé.

Le reste des modifications concerne essentiellement les descriptions et les conditions d'applicabilité des aides.

### v1.0.0-beta2

Cette version beta2 nous sert à publier le modèle sur NPM, modèle que l'on a déjà mis en ligne il y a plus d'une semaine sans retour de bug important pour l'instant.

Attention, le fichier publicodes exposé par le module NPM se nomme maintenant `mesaidesreno.model.json`, à la racine du projet. Cela permet à l'[outil d'import officiel](https://github.com/publicodes/tools) de publicodes de le reconnaitre.

Il est dispo aussi directement sur le Web via https://mesaidesreno.beta.gouv.fr/modèle.json.

### v1.0.0-beta1

Dans cette nouvelle version du modèle Mes Aides Réno, de nombreuses aides d'ampleur font leur apparition, dans le but de proposer le calcul de la plupart des aides nationales d'ampleur.

C'est une version majeure. De nombreuses aides étaient déjà implémentées en version brouillon. À partir de cette version, elles sont intégrées dans l'interface principale mesaidesreno.beta.gouv.fr et donc sont toutes dorénavant fonctionnelles. Par exemple, le dispositif Denormandie ou l'exonération de taxe foncière, qui ont chacun un fichier publicodes.

De toutes nouvelles aides font également leur apparition, notamment des aides nationales (le PAR, Prêt Avance Rénovation) ou locales (un brouillon des aides de Narbonne).

Le suffixe _beta_ restera présent pendant les premières semaines de mise en ligne de cette version majeure de l'interface, pour accueillir les éventuels problèmes qui nous seront remontés.

Comme changements importants, nous pouvons citer ceux-ci :

- le fichier ampleur.publicodes vient centraliser les aides d'ampleur pour facilement créer des simulateurs (publicodes se charge à partir de `ampleur . tous les dispositifs` de poser les bonnes questions) ou de sommer les aides en € subventionnés (`ampleur . montant`)
- nouvelle variable "vous . propriétaire . statut" qui capte plus d'informations que "vous . propriétaire . condition" qui elle passe d'une question à un calcul à partir de cette première
- intégration dans le modèle publicodes d'une partie des "conditions d'éligibilité" et des "informations utiles" des aides d'ampleur, qui étaient auparavant codées en HTML dans l'interface, hors du modèle
- nous transformons progressivement les fichiers .yaml en .publicodes pour clarifier leur type et profiter de la nouvelle [coloration syntaxique](https://github.com/publicodes/language-server) publicodes

Vu l'ampleur des changements de cette version, nous vous conseillons de l'explorer en détail dans le [jeu de changement](https://github.com/betagouv/reno/pull/187/files), en choisissant dans le menu de gauche le dossier "règles" pour vous concentrer sur la sous-section modèle de ce jeu de changement qui concerne également l'interface.

Dernier point : un [paquet NPM](https://www.npmjs.com/package/mesaidesreno) fait son apparition. Il n'a pour l'instant qu'un but : exposer une compilation JSON de l'ensemble des aides du modèle pour être intégré en quelques lignes de code dans un projet Javascript. Un guide sera publié sur la page /api-doc bientôt.

### v0.7.0

Dans le parcours par gestes, les CEE font leur apparition, aussi bien les primes coup de pouce qu'une partie (réservée aux particuliers) des aides CEE normales.

Un nouveau parcours pour les copropriétés a également [fait sont apparition](https://mesaidesreno.beta.gouv.fr/copropriete).

Ces deux grosses nouveautés sont donc naturellement disponible dans le modèle de calcul global Mes Aides Réno.

### v0.6.0

Nous avons déplacé l'écrètement depuis la règle MaPrimeRénov' parcours accompagné vers la nouvelle règle "aides globales". En effet, même si l'écrêtement pouvait agir sur cette première seule (semblerait-il du fait d'une erreur de conception de l'aide sur la tranche revenus supérieurs), il prend surtout son sens sur un ensemble cumulatif d'aides, dont les aides locales.

Voici [le commit](https://github.com/betagouv/reno/commit/52e2ba8c267a7df6acc46bc926ea1e30363dd855) principal de cette version.

### v0.5.0

Changement cassant : nous avons trouvé des bugs dans nos barèmes de revenu, qui sont maintenant corrigés.

- notre système de maximum, mis en place pour optimiser la génération des questions, était sujet à oubli de mise à jour (constaté), confusion. Nous l'avons enlevé.
- les seuils sont tous augmenté d'1 €, car le barème national France-Rénov semble avoir une mauvaise utilisation, ou du moins une ambiguité, du "jusqu'à". Leur "jusqu'à 24004" signifie en fait "inférieur strict à 24005".

### v0.4.1

Intégration des changements des montanst pour les aides MaPrimeRénov' par geste biomasse au 1er avril 2024. [Commit](https://github.com/betagouv/reno/commit/3f0bcffa758dae6028ee472410e6af0d057ee12f).

### v0.4.0

Nous décidons de mettre dans ce fichier les changements du modèle pour réserver la page [releases](https://github.com/betagouv/reno/releases) aux changements majeures d'interface.

#### Changement cassant

Les entrées de codes géographiques commune et région sont maintenant des chaînes de caractères, plutôt que des entiers.

Voir [ce commit](https://github.com/betagouv/reno/commit/e0a25017fb59550a7a0865166d20c048caa4d149) pour comprendre le changement et sa raison.
