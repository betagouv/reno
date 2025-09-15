import { useMemo } from 'react'
import CopyButton from '../CopyButton'
import rules from '@/app/règles/rules'
import Publicodes from 'publicodes'

const noDefaultsRules = Object.fromEntries(
  Object.entries(rules).map(([k, v]) => {
    if (v == null) return [k, v]
    const { 'par défaut': défaut, ...noDefault } = v

    return [k, noDefault]
  }),
)

const noDefaultsEngine = new Publicodes(noDefaultsRules)

export default function ArgileFormHeader({
  currentQuestion,
  searchParams,
  nextQuestions,
  answeredQuestions,
  situation,
  engine,
}) {
  console.log({ nextQuestions, answeredQuestions })

  const evaluation = useMemo(() => {
    return noDefaultsEngine.setSituation(situation).evaluate('rga . montant')
  }, [situation])
  console.log('mv', evaluation)

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
          {currentQuestion.startsWith('projet') ? 'Mon projet' : 'Ma situation'}
          <span className="fr-stepper__state">
            Étape {currentQuestion.startsWith('projet') ? 2 : 1} sur 4
          </span>
        </h1>
        <div
          className="fr-stepper__steps"
          data-fr-current-step={currentQuestion.startsWith('projet') ? 2 : 1}
          data-fr-steps="4"
        ></div>
        <p className="fr-stepper__details">
          <span className="fr-text--bold">Étape suivante :</span>{' '}
          {currentQuestion.startsWith('projet') ? 'Mes aides' : 'Mon projet'}
        </p>
      </div>
    </section>
  )
}
