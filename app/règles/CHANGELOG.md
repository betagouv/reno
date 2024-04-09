# Notes de version du modèle

## À propos

### Versionage sémantique

À chaque changement du modèle, si le changement est cassant, nous publions une nouvelle version majeure (2.1.2 -> 3.0.0) pour signaler le changement cassant. Par exemple, une variable d'entrée renommée.

> MAJOR version when you make incompatible API changes

À l'inverse si c'est par exemple une amélioration substantielle du calcul, une nouvelle aide, ou juste la documentation d'une variable qui est améliorée, c'est un changement mineur (2.1.2 -> 2.1.3).

> MINOR version when you add functionality in a backward compatible manner

Si c'est une correction de bug sans incidence sur les réintégrateurs, c'est une version dite patch.

> PATCH version when you make backward compatible bug fixes

### Externalisation du modèle ?

Dans un premier temps, je pense que nous devons garder le modèle et le code JS sur le même dépot, et les versions sont unifiées : on y met les changement de l'interface comme du modèle.

Dans un second temps, nous pourrons imaginer découpler les deux.

On pourra publier paquet NPM à chaque changement de version qui expose le modèle publicodes. On peut aussi inscrire dans l'URL de l'API exposée par `/api/routes.ts` le numéro de version.

Et prendre les demandes de nos réintégrateurs au fur et à mesure.

## Versions

### v0.4.1

Intégration des changements des montanst pour les aides MaPrimeRénov' par geste biomasse au 1er avril 2024. [Commit](https://github.com/betagouv/reno/commit/3f0bcffa758dae6028ee472410e6af0d057ee12f).

### v0.4.0

Nous décidons de mettre dans ce fichier les changements du modèle pour réserver la page [releases](https://github.com/betagouv/reno/releases) aux changements majeures d'interface.

#### Changement cassant

Les entrées de codes géographiques commune et région sont maintenant des chaînes de caractères, plutôt que des entiers.

Voir [ce commit](https://github.com/betagouv/reno/commit/e0a25017fb59550a7a0865166d20c048caa4d149) pour comprendre le changement et sa raison.
