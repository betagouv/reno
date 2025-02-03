import follow from 'follow-redirects'
import fs from 'fs'

const { https } = follow
const sources = [
  /* Source désactivée suite à indisponibilité des données sur data.gouv.fr suite à une MAJ foireuse on dirait. 
   * Voir cette question posée : https://www.data.gouv.fr/fr/datasets/liste-des-communes-couvertes-par-des-operations-de-revitalisation-de-territoire/#/discussions/67a0f311ca46c6b7385806b4
  {
    page: 'https://www.data.gouv.fr/fr/datasets/liste-des-communes-couvertes-par-des-operations-de-revitalisation-de-territoire/#/resources',
    data: 'https://www.data.gouv.fr/fr/datasets/r/17a6bc80-297a-4dc2-b98c-3edc12161bc0',
    downloadPath: './data/ort.csv',
  },
  */
  {
    page: 'https://www.data.gouv.fr/fr/datasets/programme-action-coeur-de-ville/',
    data: 'https://www.data.gouv.fr/fr/datasets/r/f547b346-af1e-41b5-b647-8f23e71ffe1c',
    downloadPath: './data/coeur-de-ville.csv',
  },
]

console.warn(
  '⚠️ Attention, une source est désactivée temporairement. Penser à la réactiver quand elle redevient dispo',
)

sources.forEach((source) => {
  const file = fs.createWriteStream(source.downloadPath)
  https.get(source.data, function (response) {
    response.pipe(file)

    // after download completed close filestream
    file.on('finish', () => {
      file.close()
      console.log(`Download of ${source.downloadPath} completed`)
    })
  })
})
