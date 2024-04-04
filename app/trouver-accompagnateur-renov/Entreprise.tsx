import { getAdresse } from './MarSearch'

export default function Entreprise({ data }) {
  const [rue, ville] = getAdresse(data)
  return (
    <div>
      <div>
        <strong>{data.raison_sociale}</strong>
      </div>
      <div>
        <small>{rue}</small>
      </div>
      <div>
        <small>{ville}</small>
      </div>
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
      {data.horaire && (
        <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          🕑️{' '}
          <ul
            css={`
              list-style-type: none;
              padding-left: 0.6rem;
              margin: 1rem 0 0 1rem;
              border-left: 3px solid var(--color);
            `}
          >
            {data.horaire.map((horaire) => (
              <li key={horaire}>{horaire}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
