import CEEAmpleurScenario from '../cee/CEEAmpleurScenario'
import AideAmpleur from './AideAmpleur'

export default function CEEAmpleur({
  rules,
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  expanded,
}) {
  const dottedName = "CEE . rénovation d'ampleur"
  const value = situation['projet . DPE visé'],
    oldIndex = +situation['DPE . actuel'] - 1,
    automaticChoice = Math.max(oldIndex - 2, 0),
    choice = value ? Math.min(automaticChoice, value - 1) : automaticChoice

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
              choice,
              oldIndex,
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
