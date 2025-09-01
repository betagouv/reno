import Badge from '@codegouvfr/react-dsfr/Badge'
import { Card } from '../UI'
import AideAmpleur from './AideAmpleur'
import { Highlight } from '@codegouvfr/react-dsfr/Highlight'

export default function EcoPTZ({
  isEligible,
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  expanded,
}) {
  const dottedName = 'PTZ'

  return (
    <AideAmpleur
      {...{
        isEligible,
        engine,
        dottedName,
        setSearchParams,
        answeredQuestions,
        situation,
        expanded,
      }}
    >
      {expanded && (
        <>
          <p>
            L'éco-PTZ est particulièrement adapté pour{' '}
            <a
              rel="noopener external"
              className="fr-link"
              href="https://www.service-public.fr/particuliers/vosdroits/F36448"
            >
              couvrir le reste à charge des travaux
            </a>{' '}
            du parcours MaPrimeRénov' parcours accompagné.
          </p>
          <p>
            L'éco-prêt à taux zéro est accessible à tous, sans condition de
            ressources.
          </p>
          <p>
            Vous pouvez emprunter jusqu'à <Badge noIcon>50 000 €</Badge> pour
            une rénovation d'ampleur.
          </p>
          <p>La durée du remboursement est de 20 ans maximum.</p>

          <Highlight>
            Par rapport à un prêt à la consommation de 50 000 € affecté aux
            travaux à un taux de 5 % sur 20 ans, l'éco-PTZ peut vous faire
            économiser{' '}
            <Badge noIcon>
              <a
                rel="noopener external"
                className="fr-link"
                href="https://www.lafinancepourtous.com/outils/calculateurs/calculateur-de-credit-immobilier/"
              >
                30 000 € d'intérêts
              </a>
            </Badge>
            .
          </Highlight>
        </>
      )}
    </AideAmpleur>
  )
}
