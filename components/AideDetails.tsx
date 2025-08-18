import Feedback from '@/app/contact/Feedback'
import BtnBackToParcoursChoice from './BtnBackToParcoursChoice'
import { decodeDottedName } from './publicodes/situationUtils'
import { omit } from './utils'
import { push } from '@socialgouv/matomo-next'
import CopyButton from './CopyButton'
import Stepper from '@codegouvfr/react-dsfr/Stepper'

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
  const AideComponent = correspondance[dottedName]

  return (
    <>
      <Stepper
        className="fr-mt-5v"
        currentStep={3}
        nextTitle={'Mes démarches'}
        stepCount={4}
        title="Mes aides"
      />
      <div
        css={`
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        `}
      >
        <BtnBackToParcoursChoice
          {...{
            setSearchParams,
            situation: omit(['details'], situation),
            answeredQuestions,
          }}
        />
        <CopyButton searchParams={searchParams} />
      </div>
      <AideComponent
        {...{
          dottedName: dottedName,
          setSearchParams,
          answeredQuestions,
          engine,
          situation,
          searchParams,
          expanded: true,
          rules,
        }}
      />
      <Feedback />
    </>
  )
}
