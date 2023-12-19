export default function APIDoc() {
  return (
    <main>
      <h2>API Ma Prime Rénov' 2024</h2>

      <p>Vous pouvez utiliser ce calculateur via notre API. </p>
      <p>
        C'est une API <a href="https://publi.codes">Publicodes</a>. Nous vous
        conseillons de faire un petit tour (10&nbsp;minutes) sur la
        documentation de Publicodes pour mieux comprendre les fondamentaux de
        notre API.
      </p>
      <p>
        Elle permet de calculer les deux parcours Ma Prime Rénov' 2024,
        accompagné et non accompagné, à partir de la situation d'un utilisateur.
        La situation comprend le revenu fiscal du foyer, les sauts de DPE
        envisagés, mais aussi le projet d'isolation par geste.
      </p>
      <p>
        L'API n'est pour l'instant disponible qu'en méthode <em>GET</em> : tous
        les paramètres de la simulation sont à sérialiser dans l'unique URL de
        simulation.
      </p>
    </main>
  )
}
