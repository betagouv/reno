import checkIcon from '@/public/check.svg'
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
          <h3>Comment est calculée l'aide ?</h3>
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

          <h3>Les principales conditions d'éligibilité ?</h3>
          <div
            css={`
              list-style-image: url(${checkIcon.src});
              li {
                margin: 1rem 0;
                ul {
                  list-style-image: none;
                }
              }
            `}
            dangerouslySetInnerHTML={{
              __html: rules[dottedName].conditionsEligibilitesHTML,
            }}
          />
        </>
      )}
    </AideAmpleur>
  )
}
