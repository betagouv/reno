import Feedback from '@/app/contact/Feedback'
import { createExampleSituation } from './ampleur/AmpleurSummary'
import BtnBackToParcoursChoice from './BtnBackToParcoursChoice'
import { CustomQuestionWrapper } from './CustomQuestionUI'
import { decodeDottedName } from './publicodes/situationUtils'
import { Section } from './UI'
import { omit } from './utils'
import { push } from '@socialgouv/matomo-next'

export default function AideDetails({
  setSearchParams,
  situation,
  rules,
  engine,
  answeredQuestions,
  searchParams,
  correspondance,
}) {
  const dottedName = decodeDottedName(searchParams['details'])
  push([
    'trackEvent',
    'Simulateur Principal',
    'Page',
    'Aide Détails ' + dottedName,
  ])
  const exampleSituation = createExampleSituation(engine, situation, false)
  const AideComponent = correspondance[dottedName]

  if (AideComponent)
    return (
      <Section>
        <CustomQuestionWrapper>
          <BtnBackToParcoursChoice
            {...{
              setSearchParams,
              situation: omit(['details'], situation),
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
          <Feedback title={'Ce simulateur a-t-il été utile ?'} />
        </CustomQuestionWrapper>
      </Section>
    )
}
