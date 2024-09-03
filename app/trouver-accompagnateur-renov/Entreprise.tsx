import { Card } from '@/components/UI'
import { getAdresse } from './MarSearch'

export default function Entreprise({ data }) {
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
  const horaires = data.plage_ouverture && JSON.parse(data.plage_ouverture)
  const telephones = data.telephone && JSON.parse(data.telephone)
  const lastModified = data.date_modification
  const sites = data.site_internet && JSON.parse(data.site_internet)
  return (
    <Card
      css={`
        a {
          overflow-x: scroll;
          display: block;
        }
        h4 {
          margin: 0;
        }
      `}
    >
      <h4>{nom || data.nom}</h4>
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
      {telephones?.length > 0 && (
        <div>
          <a
            href={`tel:${telephones[0].valeur}`}
            title="Contacter cette entreprise par téléphone"
          >
            {telephones[0].valeur}
          </a>
        </div>
      )}
      {data.adresse_courriel && (
        <div>
          <a
            href={`mailto:${data.adresse_courriel}`}
            title="Contacter cette entreprise par courriel"
          >
            {data.adresse_courriel}
          </a>
        </div>
      )}
      {sites?.length > 0 && (
        <div>
          <a href={sites[0].valeur} target="_blank">
            {sites[0].valeur}
          </a>
        </div>
      )}
      {horaires?.length > 0 && (
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
              const {
                nom_jour_debut,
                nom_jour_fin,
                valeur_heure_debut_1,
                valeur_heure_fin_1,
                valeur_heure_debut_2,
                valeur_heure_fin_2,
                commentaire = '',
              } = horaire
              return (
                <li key={JSON.stringify(horaire)}>
                  <div>
                    Du {nom_jour_debut} au {nom_jour_fin}, de{' '}
                    {valeur_heure_debut_1} à {valeur_heure_fin_1}
                    {valeur_heure_debut_2 ? (
                      <span>
                        , puis de {valeur_heure_debut_2} à {valeur_heure_fin_2}
                      </span>
                    ) : null}
                    .{' '}
                  </div>
                  <div>{commentaire || data.commentaire_plage_ouverture}</div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
      {lastModified && (
        <div
          css={`
            margin-top: 1rem;
            text-align: right;
          `}
        >
          <small>Mis à jour le {lastModified}</small>
        </div>
      )}
    </Card>
  )
}
