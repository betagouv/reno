import { Key } from '../explications/ExplicationUI'
import { Card, ExternalLink } from '../UI'
import AideAmpleur from './AideAmpleur'

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
      {' '}
      {expanded && (
        <p>
          L'éco-PTZ est particulièrement adapté pour{' '}
          <ExternalLink href="https://www.service-public.fr/particuliers/vosdroits/F36448">
            {' '}
            couvrir le reste à charge des travaux{' '}
          </ExternalLink>{' '}
          du parcours MaPrimeRénov' parcours accompagné.
        </p>
      )}
      {expanded && (
        <>
          <p>
            L'éco-prêt à taux zéro est accessible à tous, sans condition de
            ressources.
          </p>
          <p>
            Vous pouvez emprunter jusqu'à{' '}
            <Key $state="prime-black">50 000 €</Key> pour une rénovation
            d'ampleur.
          </p>
          <p>La durée du remboursement est de 20 ans maximum.</p>
          <Card
            $background="#EEEEFF"
            css={`
              padding: 1rem;
            `}
          >
            <div
              css={`
                display: flex;
                align-items: center;
              `}
            >
              <p>
                Par rapport à un prêt à la consommation de 50 000 € affecté aux
                travaux à un taux de 5 % sur 20 ans, l'éco-PTZ peut vous faire
                économiser{' '}
                <Key $state="prime-black">
                  <ExternalLink href="https://www.lafinancepourtous.com/outils/calculateurs/calculateur-de-credit-immobilier/">
                    30 000 € d'intérêts
                  </ExternalLink>
                </Key>
                .
              </p>
            </div>
          </Card>
        </>
      )}
    </AideAmpleur>
  )
}
