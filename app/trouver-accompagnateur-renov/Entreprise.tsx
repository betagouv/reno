import { Card } from '@/components/UI'
import { getAdresse } from './MarSearch'

export default function Entreprise({ data }) {
  console.log('data', data)
  if (!data)
    return (
      <p>
        Conseiller non trouvé, n'hésitez pas à choisir la grande ville près de
        chez vous.
      </p>
    )
  const [nom, rue, ville] = getAdresse(data)
  // le {nom} de l'entité n'est pas très utile, car c'est toujours empiriquement "Espace France Rénov [ville ou EPCI], le complementx de l'adresse est plus informatif
  const { latitude, longitude } = JSON.parse(data.adresse || '[{}]')[0]
  const horaires = JSON.parse(data.Horaires_Structure)
  const telephone = data.Telephone_Structure

  const siteRaw = data.Site_Internet_Structure,
    site = siteRaw?.startsWith('http') ? siteRaw : 'https://' + siteRaw

  return (
    <Card
      css={`
        a {
          display: block;
        }
        h4 {
          margin: 0;
        }
      `}
    >
      <h4>{nom}</h4>
      <br />
      <div>
        <small>{rue}</small>
      </div>
      <div>
        <small>{ville}</small>
      </div>
      {latitude && longitude && (
        <div>
          <a
            href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`}
            target="_blank"
          >
            Voir sur une carte
          </a>
        </div>
      )}
      <br />
      {telephone && (
        <div>
          <a
            href={`tel:${telephone}`}
            title="Contacter cette entreprise par téléphone"
          >
            {telephone}
          </a>
        </div>
      )}
      {data.Email_Structure && (
        <div>
          <a
            href={`mailto:${data.Email_Structure}`}
            title="Contacter cette entreprise par courriel"
          >
            {data.Email_Structure}
          </a>
        </div>
      )}
      {site && (
        <div>
          <a href={site} target="_blank">
            {site}
          </a>
        </div>
      )}
      {horaires[0] != '' && (
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
            {horaires.map((horaire) => {
              return (
                <li key={JSON.stringify(horaire)}>
                  <div>{horaire}</div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </Card>
  )
}
