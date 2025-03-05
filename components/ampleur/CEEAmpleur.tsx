import CEEAmpleurScenario from '../cee/CEEAmpleurScenario'
import AideAmpleur from './AideAmpleur'

export default function CEEAmpleur({
  isEligible,
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
        isEligible,
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
