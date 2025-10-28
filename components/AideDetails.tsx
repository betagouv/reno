import Feedback from '@/app/contact/Feedback'
import BtnBackToParcoursChoice from './BtnBackToParcoursChoice'
import { decodeDottedName } from './publicodes/situationUtils'
import { omit } from './utils'
import { push } from '@socialgouv/matomo-next'
import { useEffect } from 'react'
import { BlocEtMaintenant } from './Eligibility'
import AvertissementSimulation, {
  useAvertissementState,
} from './AvertissementSimulation'
import Button from '@codegouvfr/react-dsfr/Button'

export default function AideDetails({
  nbStep,
  setSearchParams,
  situation,
  rules,
  engine,
  answeredQuestions,
  searchParams,
  correspondance,
}) {
  const dottedName = decodeDottedName(searchParams['details'])
  useEffect(() => {
    push([
      'trackEvent',
      'Simulateur Principal',
      'Page',
      'Aide Détails ' + dottedName,
    ])
  }, [])
  const [avertissementState, setAvertissementState] = useAvertissementState()
  const AideComponent = correspondance[dottedName]

  return (
    <div style={{ maxWidth: '50rem', margin: 'auto' }}>
      <AvertissementSimulation
        {...{ avertissementState, setAvertissementState }}
      />
      <div id="fr-stepper-_r_f_" className="fr-stepper fr-mt-5v">
        <span className="fr-stepper__title fr-mb-3v">
          Mes aides
          <span className="fr-stepper__state">
            Étape {nbStep - 1} sur {nbStep}
          </span>
        </span>
        <div
          className="fr-stepper__steps"
          data-fr-current-step={nbStep - 1}
          data-fr-steps={nbStep}
        ></div>
        <p className="fr-stepper__details">
          <span className="fr-text--bold">Étape suivante :</span> Mes démarches
        </p>
      </div>
      {dottedName != 'MPR . accompagnée' && (
        <BlocEtMaintenant
          title={<>Psst ! Votre projet mérite un vrai coup de pouce</>}
          setSearchParams={setSearchParams}
          withCTA
        >
          <p className="fr-callout__text">
            Le service public vous accompagne : parlez à un conseiller France
            Rénov'.
          </p>
        </BlocEtMaintenant>
      )}
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
      <div
        className="fr-mb-3v"
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
        <Button
          title="Voir mes démarches"
          iconPosition="right"
          iconId="fr-icon-arrow-right-line"
          linkProps={{
            href: setSearchParams({ objectif: 'etape' }, 'url'),
          }}
        >
          Voir mes démarches
        </Button>
      </div>
      <Feedback />
    </div>
  )
}
