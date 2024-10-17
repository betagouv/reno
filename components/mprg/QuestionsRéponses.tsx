import { BlocQuestionRéponse } from '../BlocQuestionRéponse'
import Value from '@/components/Value'

export default function QuestionsRéponses() {
  return (
    <BlocQuestionRéponse>
      <details>
        <summary open={false}>Y a-t-il un montant maximum d'aides ?</summary>

        <p>
          Le montant cumulé de MaPrimeRénov’, des aides des fournisseurs
          d’énergie et des aides versées par la Commission de régulation de
          l’énergie en Outre-mer ne peut pas dépasser, pour votre ménage de
          classe de revenu{' '}
          <Value
            {...{
              engine,
              situation: { ...situation },
              dottedName: 'ménage . revenu . classe',
              state: 'emphasize',
            }}
          />
          , un maximum de{' '}
          <Value
            {...{
              engine,
              situation: { ...situation },
              dottedName: "MPR . non accompagnée . pourcentage d'écrêtement",
              state: 'emphasize',
            }}
          />{' '}
          de la dépense éligible.
        </p>
        <p>
          Le montant cumulé de MaPrimeRenov’ et de toutes les aides publiques et
          privées perçues ne peut pas dépasser 100 % de la dépense éligible
          après remise, ristourne ou rabais des entreprises.
        </p>
        <p>
          Cette règle est appellée <em>écrêtement</em>.
        </p>
      </details>
      <details>
        <summary open={false}>
          Avec quelles professionnels puis-je bénéficier de ces primes ?
        </summary>
        <p>
          Les entreprises qui feront les travaux{' '}
          <strong>
            doivent être{' '}
            <a
              href="https://www.ecologie.gouv.fr/label-reconnu-garant-lenvironnement-rge"
              target="_blank"
            >
              certifiées RGE
            </a>
          </strong>{' '}
          pour que vous puissiez rentrer dans le parcours MaPrimeRénov' et
          bénéficier des primes ci-dessus.
        </p>
      </details>
      <details>
        <summary open={false}>Les montants incluent-ils la pose ?</summary>
        <p>
          Oui. La dépense éligible correspond au coût du matériel, pose
          comprise.
        </p>
      </details>
      <details>
        <summary open={false}>Peut-on cumuler les aides ?</summary>
        <p>
          Il est possible d’obtenir plusieurs fois MaPrimeRénov’ gestes pour des
          travaux différents au sein d’un même logement (par exemple : des
          travaux portant sur une autre surface du logement ou sur un autre
          équipement), dans la limite de 20 000 € de travaux par logement sur 5
          ans.
        </p>
        <p>
          MaPrimeRénov’ gestes est cumulable avec les aides versées par les
          fournisseurs d’énergie (CEE) ainsi que les aides des collectivités
          locales et des caisses de retraite
        </p>
        <details>
          <summary open={false}>Si vous êtes propriétaire bailleur</summary>

          <p>
            Les propriétaires bailleurs peuvent déposer des dossiers pour 3
            logements diffé - rents maximum, dans la limite de 20 000€ de
            travaux par logement sur 5 ans. Ils peuvent par ailleurs bénéficier
            de MaPrimeRénov’ en tant que propriétaire occupant, pour leur
            résidence principale ;
          </p>
        </details>
      </details>
    </BlocQuestionRéponse>
  )
}
