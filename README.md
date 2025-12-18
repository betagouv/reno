# MesAidesRéno est transféré à FranceRénov'
[!IMPORTANT]
- ⛔️ Ce projet n'est plus en développement actif. La dernière évolution majeur de ce projet est la prise en compte des aides à la rénovation énergétique au 01/01/2026. Consultez [les dernières évolutions](https://github.com/betagouv/reno/commits/master/).
- ➡️  Le projet a été repris par l'administration porteuse de la politique publique. Il est à retrouver sur [mesaides.france-renov.gouv.fr](https://mesaides.france-renov.gouv.fr/). Plus d'infos sur [la fiche produit](https://beta.gouv.fr/startups/mesaidesreno.html).
-  ✨ Le code du nouveau projet sera bientôt ouvert, à retrouver sur [github.com/anahgouv](https://github.com/anahgouv).

# Informations sur le dépôt MesAidesRéno
## Informations sur le modèle de calcul
> En tant que seul modèle ouvert et officiel des aides à la rénovation énergétique françaises, de nouvelles versions sont publiées fréquemment, potentiellement toutes les semaines.
> En particulier, le modèle de calcul évolue en fonction de la loi et des améliorations métier, selon le versionage sémantique.
> Si vous l'intégrez, il est de votre responsabilité de le maintenir à jour régulièrement en suivant les changements de ce dépôt.

## Le calcul des aides

Sur /, dans un premier temps, les aides nationales : MPR accompagnée, et MPR non accompagnée (dit aussi gestes). Nous y avons ajouté les aides des fournisseurs d’énergie (certificats d’économies d’énergie – CEE), l'aide copropriété, et de nombreuses aides à la rénovation d'ampleur.

Suivez les changements du modèle via le [fichier CHANGELOG](https://github.com/betagouv/reno/blob/master/app/r%C3%A8gles/CHANGELOG.md)\*\*.

## Le coût des travaux

Sur /couts, des statistiques sur le coût des travaux. Nécessite une clef d'accès, les données étant pour l'instant privées.

## Côté technologie

C'est un site en NextJS et [Publicodes](https://publi.codes).

Plus d'infos dans ce [document d'architecture](https://github.com/betagouv/reno/blob/master/architecture.mdx).

## Le module NPM

Un premier [module NPM](https://www.npmjs.com/package/mesaidesreno) est intégrable facilement dans toute application JS, ou dans n'importe quel environnement via des [fonctions lambda](https://github.com/betagouv/reno/blob/master/app/api/route.ts).

À chaque `yarn build`, la fonction `writePublicodeJson` est executée. Le modèle est donc écrit en JSON consolidé dans le fichier mesaidesreno.model.json, un standard dans le monde publicodes. Ce fichier est ignoré par .gitignore, mais sera mis en ligne sur notre module NPM.

Pour chaque nouvelle version, il faut mettre à jour le numéro de version dans le `package.json` en suivant le [versionage sémantique](https://github.com/betagouv/reno/issues/41).

Pour publier la nouvelle version après ces deux étapes, il suffit de faire `npm publish`.

## L'API

Nous proposons une version beta d'une [API de calcul hébergée chez nous](https://mesaidesreno.beta.gouv.fr/api-doc) et déployable facilement chez vous, pour en maitriser les versions.
