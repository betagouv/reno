import Entreprise from './Entreprise'

export default function Entreprises({ data, codeInsee }) {
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

  return <Entreprise data={data[0]} />
}
