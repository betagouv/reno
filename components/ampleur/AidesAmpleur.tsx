import { createExampleSituation } from './AmpleurSummary'
import BtnBackToParcoursChoice from '../BtnBackToParcoursChoice'
import { CustomQuestionWrapper } from '../CustomQuestionUI'
import FatConseiller from '../FatConseiller'
import { useAides } from './useAides'
import { omit } from '@/components/utils'
import { Section } from '../UI'
import Feedback from '@/app/contact/Feedback'
import { push } from '@socialgouv/matomo-next'
import CopyButton from '../CopyButton'
import Breadcrumb from '../Breadcrumb'
import { encodeDottedName, encodeSituation } from '../publicodes/situationUtils'

export default function AidesAmpleur({
  setSearchParams,
  situation: givenSituation,
  answeredQuestions,
  engine,
  rules,
  searchParams,
  correspondance,
}) {
  push(['trackEvent', 'Simulateur Principal', 'Page', 'Aides Ampleur'])
  const situation = givenSituation

  const extremeSituation = createExampleSituation(situation, 'best')

  const aides = useAides(engine, extremeSituation)
  // On filtre les remboursements (donc MPRA et subvention MAR) car ils sont affichés différement
  const eligibles = aides.filter(
    (aide) => aide.status === true && aide.type !== 'remboursement',
  )
  const nonEligibles = aides.filter((aide) => aide.status === false)
  const neSaisPas = aides.filter((aide) => aide.status === null)

  const renderAides = (aidesList, title, isEligible) => {
    if (aidesList.length === 0) return null
    let lastType = null
    return (
      <>
        {isEligible !== null && (
          <h2 title={title}>
            <span
              css={`
                color: var(--color);
              `}
              dangerouslySetInnerHTML={{
                __html:
                  title +
                  '&nbsp;' +
                  (isEligible === false
                    ? `<strong style="color: var(--color);">${aidesList.length}</strong>&nbsp;aides`
                    : ''),
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
        <section>
          {aidesList.map((aide, i) => {
            const AideComponent = correspondance[aide.baseDottedName]
            const currentType = rules[aide.baseDottedName].type
            const showType = currentType !== lastType && isEligible
            lastType = currentType
            return (
              <div key={i}>
                {showType && (
                  <div
                    css={`
                      font-weight: bold;
                      margin: 1rem 0;
                    `}
                  >
                    {rules[aide.baseDottedName].type === 'remboursement' ? (
                      <>
                        <span aria-hidden="true">💶</span> Remboursements
                      </>
                    ) : rules[aide.baseDottedName].type === 'prêt' ? (
                      <>Prêts à 0 %</>
                    ) : (
                      <>Exonérations fiscales</>
                    )}
                  </div>
                )}

                {isEligible === null && (
                  <>
                    <div
                      css={`
                        font-weight: bold;
                        margin: 1rem 0 0 0;
                      `}
                    >
                      {title}
                    </div>
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
                <div
                  id={'aide-' + encodeDottedName(aide.baseDottedName)}
                  css={`
                    border-bottom: 1px solid var(--lighterColor2);
                    margin-bottom: 1rem;
                    padding-left: 1.5rem;
                  `}
                >
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
              </div>
            )
          })}
        </section>
      </>
    )
  }

  return (
    <Section
      css={`
        h2 {
          font-size: 110%;
          display: flex;
          align-items: center;
        }
        h3 {
          font-size: 90%;
        }
        section {
          margin: 0;
        }
      `}
    >
      <CustomQuestionWrapper>
        {/* <Breadcrumb
          links={[
            {
              Eligibilité: setSearchParams(
                {
                  ...encodeSituation(
                    omit(["parcours d'aide"], situation),
                    false,
                    answeredQuestions,
                  ),
                },
                'url',
                true,
              ),
            },
            {
              Ampleur: setSearchParams(
                {
                  ...encodeSituation(situation, false, answeredQuestions),
                },
                'url',
                true,
              ),
            },
          ]}
        /> 
        <div
          css={`
            display: flex;
            justify-content: space-between;
          `}
        >
          <BtnBackToParcoursChoice
            {...{
              setSearchParams,
              situation: omit(["parcours d'aide"], situation),
              answeredQuestions,
            }}
          />
          <CopyButton searchParams={searchParams} />
        </div>
        <h1
          css={`
            font-size: 120%;
            margin: 0.5rem 0 !important;
          `}
        >
          Financer une rénovation d’ampleur
        </h1>*/}
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
        )}
        {/* <FatConseiller
          {...{
            situation,
            margin: 'small',
          }}
        />
        <Feedback /> */}
      </CustomQuestionWrapper>
    </Section>
  )
}
