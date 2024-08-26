import DPEQuickSwitch from '@/components/DPEQuickSwitch'
import DPEScenario from '@/components/mpra/DPEScenario'
import TargetDPETabs from '@/components/mpra/TargetDPETabs'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'
import { Card } from '../UI'
import PaymentTypeBlock from '../PaymentTypeBlock'
import Avance from '@/components/mpra/Avance'
import MapBehindCTA from '../MapBehindCTA'
import rules from '@/app/règles/rules'

export default function MPRA({
  oldIndex,
  choice,
  setSearchParams,
  answeredQuestions,
  engine,
  situation,
  exampleSituation,
}) {
  return (
    <AideAmpleur dottedName={'taxe foncière'}>
      <div>
        <p>
          Vore commune peut proposer une exonération de la taxe foncière de 50 %
          ou 100 % pendant 3 ans pour certains logements rénovés.
        </p>

        <InformationBlock>
          <li>Votre logement a été construit avant le 1er janvier 1989</li>
          <li>
            Un montant minimum de travaux de rénovation thermique a été engagé :
            10 000 € l'année précédente, ou 15 000 € les 3 années précédentes.
          </li>
        </InformationBlock>
        <PaymentTypeBlock>
          <p>Cette aide est une exonération de taxe locale.</p>
        </PaymentTypeBlock>
        <AideCTA text="Obtenir l'exonération">
          <p>
            Vous devez adresser au service des impôts correspondant au lieu de
            situation du bien, avant le 1 er janvier de la première année au
            titre de laquelle l’exonération est applicable, une déclaration
            comportant tous les éléments d’identification du bien, dont la date
            d’achèvement du logement.
          </p>
          <a href="https://www.impots.gouv.fr/particulier/questions/ai-je-droit-pour-ma-taxe-fonciere-lexoneration-en-faveur-des-economies">
            Plus d'infos sur impots.gouv.fr
          </a>
        </AideCTA>
      </div>
    </AideAmpleur>
  )
}
