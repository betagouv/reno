import Link from 'next/link'
import { formatValue } from 'publicodes'
import Geste from './Geste'
import { gestesMosaicQuestions, isGestesMosaicQuestion } from './GestesMosaic'
import MapBehindCTA from './MapBehindCTA'
import { Card, CTA, CTAWrapper, ExternalLink, Section } from './UI'
import { encodeDottedName } from './publicodes/situationUtils'
import { push } from '@socialgouv/matomo-next'
import Feedback from '@/app/contact/Feedback'
import FatConseiller from './FatConseiller'

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

  const firstGestesMosaicDottedName = Object.entries(rules).find(
    ([dottedName, rule]) => isGestesMosaicQuestion(dottedName, rule),
  )[0]
  return (
    <Section
      css={`
        padding-bottom: 6vh;
      `}
    >
      <CTAWrapper
        $justify="end"
        css={`
          margin-bottom: 1vh;
        `}
      >
        <CTA
          $fontSize="normal"
          $importance="secondary"
          css={`
            a {
              padding: 0.5rem 0.8rem;
            }
          `}
        >
          <Link
            onClick={() =>
              push([
                'trackEvent',
                'Simulateur Principal',
                'Clic',
                'retour sélection geste',
              ])
            }
            href={setSearchParams(
              {
                question: encodeDottedName(firstGestesMosaicDottedName),
              },
              'url',
            )}
          >
            <span aria-hidden="true">⬅</span> Retour à la sélection des gestes
          </Link>
        </CTA>
      </CTAWrapper>
      <h2
        css={`
          margin-top: 0;
        `}
      >
        Votre sélection d'aides
      </h2>
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
        <strong>gratuitement</strong> et vous aide à calculer vos aides et votre
        budget.
      </p>
      <p>
        Les montants calculés ci-dessus sont des estimations. Les primes CEE
        sont des estimations minimales qui seront à confronter aux primes
        réelles des entreprises qui vendent de l'énergie, qui peuvent décider de
        les verser en chèques, cartes cadeaux ou encore réductions.
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
    </Section>
  )
}
