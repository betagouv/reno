import { createExampleSituation } from './AmpleurSummary'
import BtnBackToParcoursChoice from '../BtnBackToParcoursChoice'
import { CustomQuestionWrapper } from '../CustomQuestionUI'
import FatConseiller from '../FatConseiller'
import { useAides } from './useAides'
import { omit } from '@/components/utils'
import { Section } from '../UI'
import Feedback from '@/app/contact/Feedback'
import { push } from '@socialgouv/matomo-next'

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

    return (
      <>
        <h2 title={title}>
          {title}&nbsp;
          {isEligible !== null && (
            <>
              <strong
                css={`
                  color: var(--color);
                `}
              >
                {aidesList.length}
              </strong>
              &nbsp;aides
            </>
          )}
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
          {aidesList.map((aide) => {
            const AideComponent = correspondance[aide.baseDottedName]
            return AideComponent ? (
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
          font-size: 100%;
        }
      `}
    >
      <CustomQuestionWrapper>
        <BtnBackToParcoursChoice
          {...{
            setSearchParams,
            situation: omit(["parcours d'aide"], situation),
            answeredQuestions,
          }}
        />
        <h1
          css={`
            font-size: 120%;
            margin: 0.5rem 0 !important;
          `}
        >
          Financer une rénovation d’ampleur
        </h1>

        {renderAides(eligibles, 'Éligible à', true)}
        {renderAides(neSaisPas, 'Aides potentielles', null)}
        {renderAides(nonEligibles, 'Non éligible à', false)}
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
