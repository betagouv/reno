import Link from 'next/link'
import PaymentTypeBlock from '../PaymentTypeBlock'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'

export default function EcoPTZ({}) {
  return (
    <AideAmpleur dottedName={'PTZ'}>
      <div>
        <p>
          Vous pouvez emprunter jusqu'à 50 000 € sur 20 ans sans devoir
          rembourser d'intérêts pour financer vos travaux de rénovation
          energétique.
        </p>

        <InformationBlock>
          <li>
            L'éco-PTZ est particulièrement adapté pour{' '}
            <a href="https://www.service-public.fr/particuliers/vosdroits/F36448">
              couvrir le reste à charge des travaux
            </a>{' '}
            du parcours MaPrimeRénov' accompagné.
          </li>
          <li>
            L'éco-PTZ est aussi disponible hors parcours MaPrimeRénov'
            accompagnée,{' '}
            <a href="https://www.service-public.fr/particuliers/vosdroits/F19905">
              de 7 000 € à 30 000 €
            </a>{' '}
            en fonction du nombre de gestes de rénovation de votre projet.
          </li>
          <li>
            Son montant dépendra de votre endettement et de votre capacité à le
            rembourser.
          </li>
        </InformationBlock>
        <PaymentTypeBlock>
          <p>Le prêt sera à rembourser mensuellement.</p>
        </PaymentTypeBlock>
        <AideCTA text="Demander le prêt à taux zéro">
          <p>
            L'éco-PTZ est disponible auprès de{' '}
            <a href="https://www2.sgfgas.fr/web/site-public/etablissements-affilies">
              ces établissements de crédits
            </a>
            . Découvrir{' '}
            <a href="https://www.service-public.fr/particuliers/vosdroits/F19905">
              la démarche étape par étape
            </a>
            .
          </p>
          <a href="https://www.impots.gouv.fr/particulier/questions/ai-je-droit-pour-ma-taxe-fonciere-lexoneration-en-faveur-des-economies">
            Plus d'infos sur impots.gouv.fr
          </a>
        </AideCTA>
      </div>
    </AideAmpleur>
  )
}
