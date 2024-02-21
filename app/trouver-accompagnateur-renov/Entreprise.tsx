export default function Entreprise({ data }) {
  return (
    <div>
      <div>
        <strong>{data.raison_sociale}</strong>
      </div>
      <small>
        {data.adresse} {data.ville}
      </small>
      <div>
        <a
          href={`tel:${data.tel}`}
          title="Contacter cette entreprise par téléphone"
        >
          {data.tel}
        </a>
      </div>
      <div>
        <a
          href={`mailto:${data.email}`}
          title="Contacter cette entreprise par courriel"
        >
          {data.email}
        </a>
      </div>
    </div>
  )
}
