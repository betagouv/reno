import DPELabel from '../dpe/DPELabel'

export default function AmpleurModuleBanner({ depuisModule, situation }) {
  if (!depuisModule) return null

  return (
    <section>
      <h2>
        Simulation pour le bien
        <City situation={situation} />
        <DPE situation={situation} />
      </h2>
    </section>
  )
}

const City = ({ situation }) => {
  const name = situation['logement . commune . nom']
  if (!name) return null
  const cleanName = name.replace(/"/g, '')
  return <span>situé à {cleanName}</span>
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
