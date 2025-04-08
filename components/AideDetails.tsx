import Feedback from '@/app/contact/Feedback'
import BtnBackToParcoursChoice from './BtnBackToParcoursChoice'
import { CustomQuestionWrapper } from './CustomQuestionUI'
import { decodeDottedName, encodeSituation } from './publicodes/situationUtils'
import { Section } from './UI'
import { omit } from './utils'
import { push } from '@socialgouv/matomo-next'
import Breadcrumb from './Breadcrumb'
import { aideTitle } from './ampleur/AideAmpleur'
import CopyButton from './CopyButton'
import Enquete from './Enquete'

export default function AideDetails({
  setSearchParams,
  situation,
  rules,
  engine,
  answeredQuestions,
  searchParams,
  correspondance,
}) {
  const dottedName = decodeDottedName(searchParams['details'])
  push([
    'trackEvent',
    'Simulateur Principal',
    'Page',
    'Aide Détails ' + dottedName,
  ])
  const AideComponent = correspondance[dottedName]

  if (AideComponent)
    return (
      <Section>
        <CustomQuestionWrapper>
          <Breadcrumb
            links={[
              {
                Eligibilité: setSearchParams(
                  {
                    ...encodeSituation(
                      omit(["parcours d'aide", 'details'], situation),
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
                    ...encodeSituation(
                      omit(['details'], situation),
                      false,
                      answeredQuestions,
                    ),
                  },
                  'url',
                  true,
                ),
              },
              {
                [aideTitle(dottedName)]: '',
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
                situation: omit(['details'], situation),
                answeredQuestions,
              }}
            />
            <CopyButton searchParams={searchParams} />
          </div>
          <Enquete />
          <AideComponent
            {...{
              dottedName: dottedName,
              setSearchParams,
              answeredQuestions,
              engine,
              situation,
              searchParams,
              expanded: true,
              rules,
            }}
          />
          {/* <Feedback title={'Ce simulateur a-t-il été utile ?'} /> */}
        </CustomQuestionWrapper>
      </Section>
    )
}
