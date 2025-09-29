import Value from '@/components/Value'
import DPEQuickSwitch from '../dpe/DPEQuickSwitch'
import TargetDPETabs from './TargetDPETabs'
import CalculatorWidget from '../CalculatorWidget'
import { BlocMontantTravaux } from '../maPrimeAdapt/MaPrimeAdapt'

export default function DPEScenario({ engine, situation, setSearchParams }) {
  const choice = situation['projet . DPE visé'] || situation['DPE . actuel'] - 2

  const engineSituation = engine.setSituation(situation)
  const revenuClasseValue = engineSituation.evaluate(
    'ménage . revenu . classe',
  ).nodeValue

  const isModeste = revenuClasseValue.includes('modeste')
  const montantTravaux =
    situation['projet . travaux'] ||
    engineSituation.evaluate('projet . travaux').nodeValue
  const futureSituation = {
    ...situation,
    'projet . DPE visé': choice,
    'projet . travaux': montantTravaux,
  }
  console.log('situation', situation)
  console.log('futureSituation', futureSituation)
  return (
    <CalculatorWidget>
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col">
          <DPEQuickSwitch
            situation={situation}
            noSuccess
            ecartClasse={2}
            possibilities={[4, 5, 6]}
          />
        </div>
        <div className="fr-col">
          <TargetDPETabs
            {...{
              ecartClasse: 2,
              setSearchParams,
              noSuccess: true,
              situation: futureSituation,
            }}
          />
        </div>
      </div>

      <p className="fr-h3">🥳 Résultats</p>
      <div>
        Vous êtes éligible à une aide de{' '}
        <Value
          {...{
            size: 'xl',
            state: 'success',
            engine,
            situation: futureSituation,
            dottedName: 'MPR . accompagnée . pourcent',
          }}
        />{' '}
        du coût de vos travaux avec un plafond de{' '}
        <Value
          {...{
            state: 'normal',
            engine,
            situation: futureSituation,
            dottedName: 'projet . travaux . plafond',
          }}
        />{' '}
        de travaux.
        {isModeste && (
          <p className="fr-my-5v">
            🍀 <strong>Bonus :</strong> En tant que ménage{' '}
            <Value
              {...{
                engine,
                situation,
                dottedName: 'ménage . revenu . classe',
                state: 'prime-black',
              }}
            />{' '}
            ,{' '}
            <Value
              {...{
                engine,
                situation,
                dottedName: 'MPR . accompagnée . pourcentage avance',
                state: 'prime-black',
              }}
            />{' '}
            de cette aide peut vous être versée en avance de vos travaux.
          </p>
        )}
        <BlocMontantTravaux
          {...{
            engine,
            situation: futureSituation,
            exampleSituation: futureSituation,
            dottedName: 'MPR . accompagnée',
            setSearchParams,
            rule: 'projet . travaux',
          }}
        />
      </div>
    </CalculatorWidget>
  )
}
