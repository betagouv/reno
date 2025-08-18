import { correspondance } from '@/app/simulation/Form'
import { push } from '@socialgouv/matomo-next'
import { useEffect } from 'react'
import { createExampleSituation } from './AmpleurSummary'
import { useAides } from './useAides'

export default function AidesAmpleur({
  setSearchParams,
  situation: givenSituation,
  answeredQuestions,
  engine,
  rules,
  searchParams,
}) {
  useEffect(() => {
    push(['trackEvent', 'Simulateur Principal', 'Page', 'Aides Ampleur'])
  }, [])
  const situation = givenSituation

  const extremeSituation = createExampleSituation(situation, 'best')

  const aides = useAides(engine, extremeSituation)
  // On filtre les remboursements (donc MPRA et subvention MAR) car ils sont affichés différement
  const eligibles = aides.filter(
    (aide) => aide.status === true && aide.type !== 'remboursement',
  )
  const nonEligibles = aides.filter((aide) => aide.status === false)
  const neSaisPas = aides.filter((aide) => aide.status === null)

  const renderAides = (
    aidesList,
    title,
    isEligible,
    hardCodedFilter = () => true,
  ) => {
    if (aidesList.length === 0) return null
    let lastType = null
    return (
      <>
        {isEligible !== null && (
          <h2 className="fr-mt-5v" title={title}>
            <span
              dangerouslySetInnerHTML={{
                __html:
                  title +
                  '&nbsp;' +
                  (isEligible === false ? `${aidesList.length} aides` : ''),
              }}
            />
          </h2>
        )}
        {isEligible === false && (
          <p
            css={`
              margin-bottom: 1.5rem;
            `}
          >
            D'après les informations que vous avez renseignées, vous n'êtes pas
            éligible à ces aides :
          </p>
        )}
        {aidesList.filter(hardCodedFilter).map((aide, i) => {
          const AideComponent = correspondance[aide.baseDottedName]
          const currentType = rules[aide.baseDottedName].type
          const showType = currentType !== lastType
          lastType = currentType
          return (
            <div key={i} className="fr-mt-5v">
              {showType && isEligible && (
                <h3>
                  {rules[aide.baseDottedName].type === 'remboursement' ? (
                    <>
                      <span aria-hidden="true">💶</span> Remboursements
                    </>
                  ) : rules[aide.baseDottedName].type === 'prêt' ? (
                    <>Prêts à 0 %</>
                  ) : (
                    <>Exonérations fiscales</>
                  )}
                </h3>
              )}
              {showType && isEligible === null && (
                <>
                  <h3 className="fr-mt-5v">{title}</h3>
                  <p
                    css={`
                      margin-bottom: 1.5rem;
                    `}
                  >
                    C'est à vous de vous renseigner pour ces aides, car nous
                    n'avons pas pu déterminer votre éligibilité :
                  </p>
                </>
              )}
              <AideComponent
                key={aide.baseDottedName}
                {...{
                  isEligible,
                  dottedName: aide.baseDottedName,
                  setSearchParams,
                  answeredQuestions,
                  engine,
                  situation,
                  searchParams,
                  rules,
                  expanded: false,
                }}
              />
            </div>
          )
        })}
      </>
    )
  }

  return (
    <>
      {renderAides(
        eligibles,
        '<span aria-hidden="true">🏦</span> Autres aides complémentaires',
        true,
      )}
      {renderAides(neSaisPas, 'Aides potentielles', null)}
      {renderAides(
        nonEligibles,
        '<span aria-hidden="true">⛔</span> Non éligible à',
        false,
        (aide) =>
          givenSituation['logement . type'] === '"maison"' &&
          aide.baseDottedName === 'ampleur . prime individuelle copropriété'
            ? false
            : true,
      )}
    </>
  )
}
