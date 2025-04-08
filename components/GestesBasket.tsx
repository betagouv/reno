import { formatValue } from 'publicodes'
import Geste from './Geste'
import { gestesMosaicQuestions } from './GestesMosaic'
import MapBehindCTA from './MapBehindCTA'
import { Card, ExternalLink, Section } from './UI'
import Feedback from '@/app/contact/Feedback'
import FatConseiller from './FatConseiller'
import BtnBackToParcoursChoice from './BtnBackToParcoursChoice'
import CopyButton from './CopyButton'
import { omit } from './utils'
import Breadcrumb from './Breadcrumb'
import { CustomQuestionWrapper } from './CustomQuestionUI'
import { encodeSituation } from './publicodes/situationUtils'
import Enquete from './Enquete'

export default function GestesBasket({
  rules,
  engine,
  situation,
  answeredQuestions,
  setSearchParams,
  searchParams,
}) {
  const gestes = gestesMosaicQuestions.filter((q) => {
    const active = situation[q[0]] === 'oui'
    return active
  })

  const evaluation = engine
      .setSituation(situation)
      .evaluate('gestes . montant'),
    total = formatValue(evaluation)

  return (
    <Section>
      <CustomQuestionWrapper>
        <Breadcrumb
          links={[
            {
              Eligibilité: setSearchParams(
                {
                  ...encodeSituation(
                    omit(["parcours d'aide", 'question'], situation),
                    false,
                    answeredQuestions,
                  ),
                },
                'url',
                true,
              ),
            },
            {
              Gestes: setSearchParams(
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
              situation: omit(['question'], situation),
              answeredQuestions,
            }}
          />
          <CopyButton searchParams={searchParams} />
        </div>
        <h2
          css={`
            margin-top: 0;
          `}
        >
          Votre sélection d'aides
        </h2>
        <Enquete />
        <ul
          css={`
            list-style-type: none;
            padding-left: 0;
            li {
              margin: 1rem 0;
            }
          `}
        >
          {gestes.map((question) => (
            <li key={question[0]}>
              <Card css={``}>
                <Geste
                  {...{
                    dottedName: question[0],
                    rules,
                    engine,
                    situation,
                    answeredQuestions,
                    setSearchParams,
                    expanded: true,
                  }}
                />
              </Card>
            </li>
          ))}
        </ul>
        <h2>Comment toucher ces aides ?</h2>
        <p>
          Un conseiller MaPrimeRénov' vous accompagne{' '}
          <strong>gratuitement</strong> et vous aide à calculer vos aides et
          votre budget.
        </p>
        <p>
          Les montants calculés ci-dessus sont des estimations. Les primes CEE
          sont des estimations minimales qui seront à confronter aux primes
          réelles des entreprises qui vendent de l'énergie, qui peuvent décider
          de les verser en chèques, cartes cadeaux ou encore réductions.
        </p>
        <small
          css={`
            display: block;
            margin: 0 0 0 auto;
            width: fit-content;
          `}
        >
          Plus d'infos à propos des CEE sur{' '}
          <ExternalLink
            href="https://www.service-public.fr/particuliers/vosdroits/F35584"
            target="_blank"
          >
            service-public.fr
          </ExternalLink>
          .
        </small>
        <FatConseiller
          {...{
            situation,
            margin: 'small',
            titre: 'Trouver mon conseiller',
            texte:
              "Un conseiller France Rénov' peut répondre à vos questions et vous guider dans votre choix. C'est 100% gratuit !",
          }}
        />
        <Feedback title="Ce simulateur a-t-il été utile ?" />
      </CustomQuestionWrapper>
    </Section>
  )
}
