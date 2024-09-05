import Entreprise from './Entreprise'

export default function Entreprises({ data }) {
  // pas possible, on filtre data en amont, TODO gérer les erreurs de requête
  if (!data) return <p>Aucun conseiller trouvé :/</p>
  
  return <Entreprise data={data[0]} />
}
