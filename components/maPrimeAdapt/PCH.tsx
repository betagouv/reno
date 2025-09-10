import rules from '@/app/règles/rules'
import CalculatorWidget from '../CalculatorWidget'
import { BlocMontantTravaux } from './MaPrimeAdapt'
import { createExampleSituation } from '../ampleur/AmpleurSummary'
import { YesNoQuestion } from '@/app/module/AmpleurQuestions'
import AideAmpleur from '../ampleur/AideAmpleur'

export default function PCH({
  isEligible,
  engine,
  situation,
  setSearchParams,
  dottedName,
  answeredQuestions,
  expanded,
}) {
  const exampleSituation = createExampleSituation(situation)
  return (
    <AideAmpleur
      {...{
        isEligible,
        engine,
        dottedName: dottedName,
        setSearchParams,
        answeredQuestions,
        situation,
        expanded,
        noCondition: true,
      }}
    >
      <h3>Comment est calculée l'aide ?</h3>
      <CalculatorWidget>
        <div className="fr-grid-row fr-grid-row--gutters fr-mt-5v">
          <div className="fr-col-12">
            <YesNoQuestion
              {...{
                setSearchParams,
                situation,
                answeredQuestions,
                rules,
                rule: 'pch . revenus taux plein',
                noSuccess: true,
              }}
            />
          </div>
        </div>
        <BlocMontantTravaux
          {...{
            engine,
            situation,
            exampleSituation,
            dottedName,
            setSearchParams,
          }}
        />
      </CalculatorWidget>
    </AideAmpleur>
  )
}
