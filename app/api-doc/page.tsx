import Link from '@/node_modules/next/link'

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
      <h3>Que permet elle ?</h3>
      <p>
        Elle permet de calculer les deux parcours Ma Prime Rénov' 2024,
        accompagné et non accompagné, à partir de la situation d'un utilisateur.
        La situation comprend le revenu fiscal du ménage, les sauts de DPE
        envisagés, mais aussi le projet d'isolation par geste.
      </p>
      <p>
        L'API n'est pour l'instant disponible qu'en méthode <em>GET</em> : tous
        les paramètres de la simulation sont à sérialiser dans l'unique URL de
        simulation.
      </p>
      <h3>Que renvoit-elle ?</h3>
      <p>
        L'API vous renvoie, pour chacun des deux dispositifs de Ma Prime Rénov'
        : le résultat numérique ou 'Non applicable', la liste des questions
        auquel l'utilisateur doit encore répondre (c'est une API
        conversationnelle), ainsi que l'objet complet de simulation Publicodes.
      </p>
      <h3>Spécification</h3>
      <p>
        Pour découvrir l'API, le plus simple est de faire votre simulation sur
        la page d'accueil, ou de cliquer directement sur un persona pour charger
        une des simulations pré-remplies, puis de préfixer l'URL de simulation
        par `/api?PARAMÈTRES`.
      </p>
      <h3>Le code</h3>
      <p>
        Tout le code du calculateur (site en NextJS), l'API (Route handler
        NextJS) ainsi que les règles de calcul complètes sont disponibles sur{' '}
        <Link href="https://github.com/laem/mar/">Github</Link>. Les règles sont
        aussi accessibles en JSON <Link href="/api/rules">cette addresse</Link>.
      </p>
      <p>
        Plutôt que de dépendre d'une API tierce, le mieux reste d'intégrer le
        moteur de calcul publicodes chez vous. Si vous êtes dans un
        environnement Javascript, il suffit de quelques lignes de code. Sinon,
        un simple projet Javascript avec ExpressJs permet de faire tourner une
        API en 30 minutes sur vos serveurs. Nous publierons un paquet NPM tout
        prêt.
      </p>
    </main>
  )
}
