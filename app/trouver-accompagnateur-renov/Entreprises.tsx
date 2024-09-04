import Entreprise from './Entreprise'

const département = (codeCommune) => ('' + codeCommune).slice(0, 2)
export default function Entreprises({ data, codeInsee }) {
  console.log('cyan data', data)
  if (!codeInsee) return null
  // pas possible, on filtre data en amont, TODO gérer les erreurs de requête
  if (!data) return <p>Aucun conseiller trouvé :/</p>
  const sameCity = data.filter((el) => el.code_insee_commune === codeInsee)

  if (sameCity.length > 1) {
    return (
      <ol
        css={`
          list-style-type: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          li {
            max-width: 32rem;
          }
        `}
      >
        {sameCity.map((el) => (
          <li key={el.id}>
            <Entreprise data={el} />
          </li>
        ))}
      </ol>
    )
  }
  const givenDépartement = département(codeInsee)

  const closestSameDépartement = data.find(
    (el) => département(el.code_insee_commune) === givenDépartement,
  )
  if (
    département(data[0].code_insee_commune) !== givenDépartement &&
    closestSameDépartement.distance < 3 * data[0].distance
  )
    return <Entreprise data={closestSameDépartement} />

  return <Entreprise data={data[0]} />
}
