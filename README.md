# Aides et coût d'une rénovation thermique en 2024


> [!IMPORTANT]
> 🚧 Ce projet est en plein développement.
> De nouvelles versions sont publiées fréquemment, potentiellement toutes les semaines.
> En particulier, le modèle de calcul évolue en fonction de la loi et des améliorations métier, selon le [versionage sémantique](https://github.com/betagouv/reno/issues/41)
> Si vous l'intégrez, il est de votre responsabilité de le maintenir à jour régulièrement.

## Le calcul des aides

Sur /, dans un premier temps, les aides nationales : MPR accompagnée, et MPR non accompagnée (dit aussi gestes). Nous y avons ajouté les CEE, et de nombreuses aides à la rénovation d'ampleur viendront les compléter. 

## Le coût des travaux

Sur /couts, des statistiques sur le coût des travaux. Nécessite une clef d'accès, les données étant pour l'instant privées.

## Tech

Site en NextJS et publicodes. [API basique](https://mar2024.vercel.app/api-doc). Intégrable facilement dans toute application JS, ou dans n'importe quel environnement via des [fonctions lambda](https://github.com/betagouv/reno/blob/master/app/api/route.ts). 
