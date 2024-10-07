import { createExampleSituation } from './ampleur/AmpleurSummary'
import { CustomQuestionWrapper } from './CustomQuestionUI'
import { decodeDottedName, encodeDottedName } from './publicodes/situationUtils'
import { useIsCompact } from './useIsInIframe'
import Feedback from '@/app/contact/Feedback'
import { correspondance } from '@/components/utils'

export default function AideDetails({
  setSearchParams,
  situation,
  rules,
  engine,
  answeredQuestions,
  nextQuestions,
  currentQuestion,
  searchParams,
}) {
  const isCompact = useIsCompact()
  const nextLink = (value) => {
    const url = setSearchParams(
      {
        [encodeDottedName("parcours d'aide")]: `"${encodeDottedName(value)}"*`,
      },
      'url',
      false,
    )
    return url
  }
  const exampleSituation = createExampleSituation(engine, situation, false)
  const dottedName = decodeDottedName(searchParams["details"])
  const AideComponent = correspondance[dottedName]

  if (AideComponent)
    return (
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
    )
}
