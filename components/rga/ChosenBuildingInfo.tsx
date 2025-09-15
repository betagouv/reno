import Badge from '@codegouvfr/react-dsfr/Badge'

export default function ChosenBuildingInfo({ situation, data }) {
  return (
    <section
      css={`
        > div {
          margin-bottom: 0.3rem;
        }
        span {
          margin-right: 0.6rem;
        }
        width: fit-content;
        animation: flash 1s;
        @keyframes flash {
          0% {
            opacity: 0.2;
            background: #18753c;
          }
          100% {
            opacity: 1;
            background: none;
          }
        }
      `}
    >
      <Badge severity="success">Bâtiment sélectionné</Badge>
      <br />
      <br />
      <div>
        <span>Adresse</span>
        <p className="fr-badge">
          {situation['logement . adresse'].replace(/"/g, '')}
        </p>
      </div>
      <div>
        <span>Aléa argiles</span>
        <p className="fr-badge">{data.alea_argiles || 'Nul'}</p>
      </div>
      {data.annee_construction && (
        <div>
          <span>Année de construction</span>
          <p className="fr-badge">{data.annee_construction}</p>
        </div>
      )}
      {data.nb_niveau && (
        <div>
          <span>Niveaux</span>
          <p className="fr-badge">{data.nb_niveau}</p>
        </div>
      )}
      <div>
        <small
          css={`
            color: #aaa;
          `}
        >
          Données issues du <a href="https://rnb.beta.gouv.fr/">RNB</a> et de la{' '}
          <a href="https://bdnb.io/">BDNB</a>
        </small>
      </div>
    </section>
  )
}
