import AideMAR from './ampleur/AideMAR'
import AidesLocales from './ampleur/AidesLocales'
import { createExampleSituation } from './ampleur/AmpleurSummary'
import CEEAmpleur from './ampleur/CEEAmpleur'
import Copro from './ampleur/Copro'
import Denormandie from './ampleur/Denormandie'
import EcoPTZ from './ampleur/EcoPTZ'
import MPRA from './ampleur/MPRA'
import PAR from './ampleur/PAR'
import TaxeFoncière from './ampleur/TaxeFoncière'
import BtnBackToParcoursChoice from './BtnBackToParcoursChoice'
import { CustomQuestionWrapper } from './CustomQuestionUI'
import { decodeDottedName } from './publicodes/situationUtils'
import { omit } from './utils'

export default function AideDetails({
  setSearchParams,
  situation,
  rules,
  engine,
  answeredQuestions,
  searchParams,
}) {
  
  const correspondance = {
    'MPR . accompagnée': MPRA,
    'MPR . accompagnée . prise en charge MAR': AideMAR,
    PTZ: EcoPTZ,
    PAR: PAR,
    'aides locales': AidesLocales,
    'ampleur . prime individuelle copropriété': Copro,
    'taxe foncière': TaxeFoncière,
    denormandie: Denormandie,
    "CEE . rénovation d'ampleur": CEEAmpleur,
  }
  const exampleSituation = createExampleSituation(engine, situation, false)
  const dottedName = decodeDottedName(searchParams["details"])
  const AideComponent = correspondance[dottedName]

  if (AideComponent)
    return (
      <CustomQuestionWrapper>
        <BtnBackToParcoursChoice
          {...{
            setSearchParams,
            situation: omit(["details"], situation),
            answeredQuestions,
          }}
        />
        <AideComponent
          {...{
            dottedName: dottedName,
            setSearchParams,
            answeredQuestions,
            engine,
            situation,
            exampleSituation,
            searchParams,
            expanded: true,
            rules,
          }}
        />
      </CustomQuestionWrapper>
    )
}
