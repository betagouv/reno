import follow from 'follow-redirects'
import fs from 'fs'

const { https } = follow
const sources = [
  {
    page: 'https://www.data.gouv.fr/fr/datasets/liste-des-communes-couvertes-par-des-operations-de-revitalisation-de-territoire/#/resources',
    data: 'https://www.data.gouv.fr/fr/datasets/r/17a6bc80-297a-4dc2-b98c-3edc12161bc0',
    downloadPath: './data/ort.csv',
    // deactivatedBecauseOfDownloadBug: 'https://www.data.gouv.fr/fr/datasets/liste-des-communes-couvertes-par-des-operations-de-revitalisation-de-territoire/#/discussions',
  },
  {
    page: 'https://www.data.gouv.fr/fr/datasets/programme-action-coeur-de-ville/',
    data: 'https://www.data.gouv.fr/fr/datasets/r/f547b346-af1e-41b5-b647-8f23e71ffe1c',
    downloadPath: './data/coeur-de-ville.csv',
  },
  {
    page: 'https://www.data.gouv.fr/datasets/registre-national-dimmatriculation-des-coproprietes/',
    data: 'https://www.data.gouv.fr/fr/datasets/r/3ea8e2c3-0038-464a-b17e-cd5c91f65ce2',
    downloadPath: './data/rnc-data-gouv-with-qpv.csv'
  }
]

sources.forEach((source) => {
  if (source.deactivatedBecauseOfDownloadBug) return
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
