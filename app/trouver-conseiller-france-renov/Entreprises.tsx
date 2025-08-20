import Entreprise from './Entreprise'

export default function Entreprises({ data }) {
  return data && <Entreprise data={data[0]} />
}
