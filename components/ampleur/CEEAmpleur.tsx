import checkIcon from '@/public/check.svg'
import CEEAmpleurScenario from '../cee/CEEAmpleurScenario'
import AideAmpleur from './AideAmpleur'
import { ConditionEligibiliteUI } from '../UI'

export default function CEEAmpleur({
  rules,
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  expanded,
}) {
  const dottedName = "CEE . rénovation d'ampleur"

  return (
    <AideAmpleur
      {...{
        engine,
        dottedName,
        setSearchParams,
        answeredQuestions,
        situation,
        expanded,
      }}
    >
      {expanded && (
        <>
          <p>
            Le montant des CEE est calculé en fonction de la performance visée
            et de la surface habitable du logement.
          </p>
          <CEEAmpleurScenario
            {...{
              rules,
              engine,
              situation,
              setSearchParams,
              answeredQuestions,
            }}
          />
        </>
      )}
    </AideAmpleur>
  )
}
