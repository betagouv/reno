import simulationConfig from '@/app/rga/simulationConfig.yaml'
import rules from '@/app/règles/rules'
import CopyButton from '../CopyButton'

const { chapitres } = simulationConfig
export default function ArgileFormHeader({ currentQuestion, searchParams }) {
  console.log('stepper', currentQuestion)
  const stepKey = currentQuestion.split(' . ')[0],
    step = chapitres.findIndex(
      (chapitre) => chapitre === stepKey || chapitre.includes(stepKey),
    ),
    stepName = rules[stepKey].titre
  return (
    <section>
      <CopyButton
        customCss={{
          float: 'right',
        }}
        searchParams={searchParams}
      />
      <div id="fr-stepper-_r_f_" className="fr-stepper fr-mt-5v">
        <h1 className="fr-stepper__title">
          {stepName}
          <span className="fr-stepper__state">
            Étape {step + 1} sur {chapitres.length}
          </span>
        </h1>
        <div
          className="fr-stepper__steps"
          data-fr-current-step={step + 1}
          data-fr-steps={chapitres.length}
        ></div>
        {false && ( // TODO
          <p className="fr-stepper__details">
            <span className="fr-text--bold">Étape suivante :</span> {chapitres}
          </p>
        )}
      </div>
    </section>
  )
}
