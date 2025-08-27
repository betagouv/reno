import DPELabel from '../dpe/DPELabel'

export default function AmpleurModuleBanner({ depuisModule, situation }) {
  if (!depuisModule) return null

  return (
    <section>
      <div>
        <h2>
          Simulation pour le bien situé
          <City situation={situation} />
          <DPE situation={situation} />
        </h2>
        <section>
          <p>
            <span className="fr-icon-success-line" aria-hidden="true"></span>{' '}
            Vous avons déjà répondu à {Object.keys(situation).length} questions,
            plus que quelques-unes pour calculer vos aides.
          </p>
        </section>
      </div>
    </section>
  )
}

const City = ({ situation }) => {
  const name = situation['logement . commune . nom']
  if (!name) return null
  const cleanName = name.replace(/"/g, '')
  return <span> à {cleanName}</span>
}
const DPE = ({ situation }) => {
  const value = situation['DPE . actuel']
  if (!value) return null

  return (
    <span>
      {' '}
      de DPE <DPELabel index={value - 1} />
    </span>
  )
}
