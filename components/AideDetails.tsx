import Feedback from '@/app/contact/Feedback'
import BtnBackToParcoursChoice from './BtnBackToParcoursChoice'
import { decodeDottedName } from './publicodes/situationUtils'
import { omit } from './utils'
import { push } from '@socialgouv/matomo-next'
import CopyButton from './CopyButton'

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
      <div id="fr-stepper-_r_f_" className="fr-stepper fr-mt-5v">
        <h1 className="fr-stepper__title">
          Mes aides
          <span className="fr-stepper__state">Étape 3 sur 4</span>
        </h1>
        <div
          className="fr-stepper__steps"
          data-fr-current-step="3"
          data-fr-steps="4"
        ></div>
        <p className="fr-stepper__details">
          <span className="fr-text--bold">Étape suivante :</span> Mes démarches
        </p>
      </div>
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
