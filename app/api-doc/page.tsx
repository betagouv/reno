import { Main, Section, Tabs, TabHeaders, TabHeader, TabPanel } from '@/components/UI';
import css from '@/components/css/convertToJs';
import Link from '@/node_modules/next/link';
import { Metadata } from 'next/types';
import AccordionComponent from './AccordionComponent';

export const metadata: Metadata = {
  title: 'API - Mes aides réno',
  description:
    "Découvrez la documentation de l'API de calcul des aides à la rénovation",
}

export default function APIDoc() {
  return (
    <Main>
      <Section>
        <h2>API Ma Prime Rénov' 2024</h2>

        <p>Vous pouvez utiliser ce calculateur via notre API. </p>
        <p>
          C'est une API <a href="https://publi.codes">Publicodes</a>. Nous vous
          conseillons de faire un petit tour (10&nbsp;minutes) sur la
          <a href="https://publi.codes/docs">documentation</a> de Publicodes pour
          mieux comprendre ses fondamentaux.
        </p>
        <p
          style={css`
            margin: 0.6rem 0;
            background: lightyellow;
            padding: 0.4rem 1rem;
          `}
        >
          ℹ️ Cette API est basée sur le modèle de calcul qui fait tourner
          mesaidesreno.betagouv.fr. C'est un produit en version beta, qui peut
          toujours contenir des inexactitudes : n'oubliez pas d'en avertir vos
          utilisateurs si cela vous semble légitime.
        </p>
        <h3>Démonstration</h3>
        <p>
          En modifiant la <em>situation</em> (à gauche), vous obtenez une{' '}
          <em>évaluation</em> (à droite) différente.
        </p>
        <AccordionComponent />
        <h3>Que permet l'API ?</h3>
        <p>
          Calculer les deux parcours Ma Prime Rénov' 2024, accompagné et non
          accompagné, ainsi que les CEE, à partir de la situation d'un
          utilisateur.
        </p>
        <p>
          La situation comprend le revenu fiscal du ménage, les sauts de DPE
          envisagés, mais aussi le projet d'isolation par geste, et quelques
          autres données.
        </p>
        <p>L'API est disponible en version GET ou POST.</p>

        <h3>Que renvoie-t-elle ?</h3>
        <p>
          L'API vous renvoie, pour chacun des deux dispositifs de Ma Prime
          Rénov' : le résultat numérique ou 'Non applicable' ainsi que la liste des
          questions auxquelles l'utilisateur doit encore répondre (c'est une API
          conversationnelle).
        </p>
        <h3>Spécification</h3>
        <p>
          Pour découvrir l'API, le plus simple est de faire votre simulation sur
          la page d'accueil, ou de cliquer directement sur un persona pour
          charger une des simulations pré-remplies, puis de préfixer l'URL de
          simulation par `/api?PARAMÈTRES`.
        </p>
        <p>
          Publicodes offre nativement une documentation Web qui vous permet
          d'explorer les calculs de façon granulaire. Pour la découvrir, suivez
          les liens "Inspection" de la{' '}
          <a href="/personas#tests">section "Tests" de la page personas</a>.
        </p>
        <h4>Mode de simulation</h4>
        <p>
          Le modèle de calcul offre deux modes de simulation : le mode "max" qui
          maximise les aides, et le mode "moyen". Ce mode ne vous importe que si
          vous voulez afficher un résultat à l'utilisateur avant qu'il finisse
          de répondre à toutes les questions. Les réponses manquantes (appelées{' '}
          <em>missing variables</em> dans Publicodes) seront remplacées par au
          choix, des valeurs maximales ou des valeurs moyennes estimées.
        </p>
        <h3>Le code</h3>
        <p>
          Tout le code du calculateur (site en NextJS), l'API (Route handler
          NextJS) ainsi que les règles de calcul complètes sont disponibles sur{' '}
          <Link href="https://github.com/betagouv/reno">Github</Link>. Les
          règles sont aussi accessibles en JSON à{' '}
          <Link href="/api/rules">cette adresse</Link>.
        </p>
        <p>
          Plutôt que de dépendre d'une API tierce, si vous avez confiance dans
          votre capacité à mettre des services en ligne, le mieux reste
          d'intégrer le moteur de calcul publicodes chez vous. C'est ce qui rend
          la démonstration plus haut si fluide, les calculs sont faits{' '}
          <em>dans votre navigateur, sans appel réseau</em>. Si vous êtes dans
          un environnement Javascript, il suffit de quelques lignes de code.
          Sinon, un simple projet Javascript avec ExpressJs permet de faire
          tourner une API en 30 minutes sur vos serveurs. Nous publierons un
          paquet NPM tout prêt.
        </p>
      </Section>
    </Main>
  );
}
