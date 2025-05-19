export default function parseDpeXml(text) {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(text, 'application/xml')
  return {
    descriptionMurs: Array.from(
      xmlDoc.querySelectorAll('mur donnee_entree description'),
    ).map((node) => node.textContent),
    plancher: Array.from(
      xmlDoc.querySelectorAll('plancher_bas donnee_entree description'),
    ).map((node) => node.textContent),
    plafond: Array.from(
      xmlDoc.querySelectorAll('plancher_haut donnee_entree description'),
    ).map((node) => node.textContent),
    baieVitree: Array.from(
      xmlDoc.querySelectorAll('baie_vitree donnee_entree description'),
    ).map((node) => node.textContent),
    porte: Array.from(
      xmlDoc.querySelectorAll('porte donnee_entree description'),
    ).map((node) => node.textContent),
    ventilation: Array.from(
      xmlDoc.querySelectorAll('ventilation donnee_entree description'),
    ).map((node) => node.textContent),
    travaux: Array.from(xmlDoc.querySelectorAll('pack_travaux')).map((pack) => {
      const travauxNodes = Array.from(pack.querySelectorAll('travaux'))
      const uniqueTravauxMap = new Map()

      travauxNodes.forEach((trav) => {
        const lotId =
          trav.querySelector('enum_lot_travaux_id')?.textContent || 'N/A'
        if (
          !uniqueTravauxMap.has(lotId) &&
          trav.querySelector('description_travaux')?.textContent != 'Sans'
        ) {
          uniqueTravauxMap.set(lotId, {
            id: lotId,
            description: trav.querySelector('description_travaux')?.textContent,
            performance: trav.querySelector('performance_recommande')
              ?.textContent,
            warning: trav.querySelector('avertissement_travaux')?.textContent,
          })
        }
      })
      return {
        conso: pack.querySelector('conso_5_usages_apres_travaux')?.textContent,
        emission: pack.querySelector('emission_ges_5_usages_apres_travaux')
          ?.textContent,
        travaux: Array.from(uniqueTravauxMap.values()),
      }
    }),
  }
}
