import Feedback from '@/app/contact/Feedback'
import BtnBackToParcoursChoice from './BtnBackToParcoursChoice'
import { decodeDottedName, encodeSituation } from './publicodes/situationUtils'
import { omit } from './utils'
import { push } from '@socialgouv/matomo-next'
import { aideTitle } from './ampleur/AideAmpleur'
import CopyButton from './CopyButton'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'

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
      <section>
        <Breadcrumb
          currentPageLabel={aideTitle(dottedName)}
          homeLinkProps={{
            href: '/',
          }}
          segments={[
            {
              label: 'Eligibilité',
              linkProps: {
                href: setSearchParams(
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
            },
            {
              label: 'Les iframes',
              linkProps: {
                href: '/integration',
              },
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
        <Feedback />
      </section>
    )
}
