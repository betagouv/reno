# Aides et coût d'une rénovation thermique en 2024

> [!IMPORTANT]
> 💡 Ce projet est en développement actif.
> En tant que seul modèle ouvert et officiel des aides à la rénovation énergétique françaises, de nouvelles versions sont publiées fréquemment, potentiellement toutes les semaines.
> En particulier, le modèle de calcul évolue en fonction de la loi et des améliorations métier, selon le versionage sémantique.
> Si vous l'intégrez, il est de votre responsabilité de le maintenir à jour régulièrement en suivant les changements de ce dépôt dont la publicité est faite via **ce fichier [CHANGELOG](https://github.com/betagouv/reno/blob/master/app/r%C3%A8gles/CHANGELOG.md)**.

## Le calcul des aides

Sur /, dans un premier temps, les aides nationales : MPR accompagnée, et MPR non accompagnée (dit aussi gestes). Nous y avons ajouté les CEE, l'aide copropriété, et de nombreuses aides à la rénovation d'ampleur.

## Le coût des travaux

Sur /couts, des statistiques sur le coût des travaux. Nécessite une clef d'accès, les données étant pour l'instant privées.

## Côté technologie

C'est un site en NextJS et [Publicodes](https://publi.codes).

Nous proposons une version beta d'une [API de calcul hébergée chez nous](https://mesaidesreno.beta.gouv.fr/api-doc) et déployable facilement chez vous, pour en maitriser les versions.

Un premier [module NPM](https://www.npmjs.com/package/mesaidesreno) est intégrable facilement dans toute application JS, ou dans n'importe quel environnement via des [fonctions lambda](https://github.com/betagouv/reno/blob/master/app/api/route.ts).
