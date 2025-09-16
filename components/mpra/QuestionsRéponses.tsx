import { BlocQuestionRéponse } from '../BlocQuestionRéponse'

export default function QuestionsRéponses() {
  return (
    <section>
      <h2>Questions fréquentes</h2>

      <BlocQuestionRéponse>
        <details>
          <summary open={false}>
            Comment choisir les travaux à réaliser ?
          </summary>
          <p>
            Pas d’inquiétudes, le dispositif MaPrimeRénov’ parcours accompagné a
            justement été conçu pour vous guider dans la construction et la mise
            en oeuvre de votre projet de rénovation.
          </p>
          <p>
            Le rôle de votre Accompagnateur Rénov’ sera de vous aider à définir
            un projet qui vous correspond, en fonction :{' '}
          </p>
          <ul>
            <li>
              des vos objectifs en terme d’économie sur vos factures, de
              réduction de votre consommation d’énergie et de diminution de
              votre empreinte écologique
            </li>
            <li>
              de la situation de votre logement et son potentiel d’amélioration
            </li>
            <li>
              et de votre budget, en prenant en compte le reste à charge après
              déduction des aides.
            </li>
          </ul>
        </details>
        <details>
          <summary open={false}>
            Quelles sont les grandes étape de MaPrimeRénov’ parcours accompagné
            ?
          </summary>
          <p>
            Mon Accompagnateur Rénov' est un interlocuteur de confiance pour
            vous accompagner. Il intervient à toutes les étapes de votre projet
            de rénovation énergétique.
          </p>
          <ol>
            <li>
              Une visite de votre logement est organisée pour évaluer sa
              situation et réaliser un audit énergétique.
            </li>
            <li>
              Votre Accompagnateur Rénov’ vous propose plusieurs scénarios de
              travaux en fonction de votre bien et de votre projet. Le choix
              d’un des scénarios proposé vous permet de valider votre
              éligibilité à l’aide MaPrimeRénov' parcours accompagné.
            </li>
            <li>
              Vous choisissez un scenario et vous contactez des artisans, qui
              doivent être{' '}
              <a
                rel="noopener external"
                className="fr-link"
                title="certifiés RGE - nouvelle fenêtre"
                href="https://www.ecologie.gouv.fr/label-reconnu-garant-lenvironnement-rge"
                target="_blank"
              >
                certifiés RGE
              </a>
              , pour obtenir des devis. Votre Accompagnateur Rénov’ vous aide a
              choisir des artisans, à sélectionner les devis et à définir un
              plan de financement.
            </li>
            <li>
              Votre Accompagnateur Rénov’ vous accompagne dans le dossier de{' '}
              <a
                rel="noopener external"
                className="fr-link"
                href="http://maprimerenov.gouv.fr/"
              >
                dépot de demande d’aide
              </a>
              .
            </li>
            <li>
              Une fois votre demande d’aide validée, les travaux sont lancés.
              Votre Accompagnateur Rénov’ vous conseille sur le suivi du
              chantier tout au long de la réalisation des travaux.
            </li>
            <li>
              La seconde visite post-travaux est faite pour confirmer la fin des
              travaux, préparer le suivi des consommations et donner des
              conseils utiles à la prise en main du logement rénové.
            </li>
          </ol>
        </details>
        <details>
          <summary open={false}>
            Quels sont les conditions pour bénéficier de MaPrimeRénov' parcours
            accompagné ?
          </summary>

          <ul>
            <li>
              L’accompagnement par Mon Accompagnateur Rénov’ est obligatoire.
            </li>
            <li>
              Un gain de 2 classes DPE au minimum est exigé. La rénovation
              énergétique peut être réalisée en 2 étapes tant que la durée des
              travaux ne dépasse pas 5 ans.
            </li>

            <li>
              Il est obligatoire de réaliser au moins deux gestes d’isolation
              (murs, fenêtres / menuiserie, sols ou toiture).{' '}
            </li>
            <li>
              Il est impossible d’installer un chauffage fonctionnant
              majoritairement aux énergies fossiles ou de conserver un chauffage
              fonctionnant au fioul ou au charbon.
            </li>
            <li>
              Il est obligatoire de vivre dans le logement les 3 années qui
              suivent la date d’acceptation de la demande d’aide.
            </li>
            <li>
              Vos artisans doivent être{' '}
              <a
                rel="noopener external"
                className="fr-link"
                title="certifiés RGE - nouvelle fenêtre"
                href="https://www.ecologie.gouv.fr/label-reconnu-garant-lenvironnement-rge"
                target="_blank"
              >
                certifiés RGE
              </a>
              .
            </li>
          </ul>
        </details>

        <details>
          <summary open={false}>
            Peut-on cumuler MaPrimeRénov’ parcours accompagné avec d’autres
            aides ?
          </summary>
          <p>
            MaPrimeRenov’ parcours accompagné n’est pas cumulable avec les aides
            des fournisseurs d’énergie (CEE).
          </p>
          <p>
            MaPrimeRenov’ parcours accompagné est cumulable avec les aides des
            collectivité locales et des caisses de retraite.
          </p>
          <p>
            L'aide du parcours accompagné est limitée par un montant maximum,
            appelé l'écrêtement, calculé ci-dessus.
          </p>
        </details>
      </BlocQuestionRéponse>
    </section>
  )
}
