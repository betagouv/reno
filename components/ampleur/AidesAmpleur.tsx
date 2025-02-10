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
import { encodeSituation } from '../publicodes/situationUtils'

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

  const exampleSituation = createExampleSituation(engine, situation, false)
  const extremeSituation = createExampleSituation(engine, situation, true)
  const aides = useAides(engine, extremeSituation) // TODO which situation

  const eligibles = aides.filter((aide) => aide.status === true)
  const nonEligibles = aides.filter((aide) => aide.status === false)
  const neSaisPas = aides.filter((aide) => aide.status === null)

  const renderAides = (aidesList, title, isEligible) => {
    if (aidesList.length === 0) return null
    let lastType = null
    return (
      <>
        <h2 title={title}>
          <span
            dangerouslySetInnerHTML={{
              __html:
                title +
                '&nbsp;' +
                (isEligible !== null
                  ? `<strong style="color: var(--color);">${aidesList.length}</strong>&nbsp;aides`
                  : ''),
            }}
          />
        </h2>
        {isEligible === null && (
          <p>
            C'est à vous de vous renseigner pour ces aides, car nous n'avons pas
            pu déterminer votre éligibilité :
          </p>
        )}
        {isEligible === false && (
          <p>
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
            return AideComponent ? (
              <div key={i}>
                {showType && (
                  <div
                    css={`
                      color: var(--mutedColor);
                      margin: 1rem 0;
                      text-transform: capitalize;
                    `}
                  >
                    {rules[aide.baseDottedName].type === 'remboursement' ? (
                      <>
                        <span aria-hidden="true">💶</span> Subventions
                      </>
                    ) : rules[aide.baseDottedName].type === 'prêt' ? (
                      <>
                        <span aria-hidden="true">🏦</span> Prêts
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true">✂</span> Exonérations fiscales
                      </>
                    )}
                  </div>
                )}
                <div
                  css={`
                    > section {
                      padding-left: 1.5rem;
                    }
                  `}
                >
                  <AideComponent
                    key={aide.baseDottedName}
                    {...{
                      dottedName: aide.baseDottedName,
                      setSearchParams,
                      answeredQuestions,
                      engine,
                      situation,
                      exampleSituation,
                      searchParams,
                      rules,
                      expanded: false,
                    }}
                  />
                </div>
              </div>
            ) : (
              <p>
                Composant pas trouvé pour {aide.baseDottedName}{' '}
                {aide.dottedName}
              </p>
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
      `}
    >
      <CustomQuestionWrapper>
        <Breadcrumb
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
        </h1>
        {renderAides(
          eligibles,
          '<span aria-hidden="true">🥳</span> Éligible à',
          true,
        )}
        {renderAides(
          neSaisPas,
          '<span aria-hidden="true">🤔</span> Aides potentielles',
          null,
        )}
        {renderAides(
          nonEligibles,
          '<span aria-hidden="true">⛔</span> Non éligible à',
          false,
        )}
        <FatConseiller
          {...{
            situation,
            margin: 'small',
          }}
        />
        <Feedback title={'Ce simulateur a-t-il été utile ?'} />
      </CustomQuestionWrapper>
    </Section>
  )
}
