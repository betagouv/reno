import Link from 'next/link'
import { formatValue } from 'publicodes'
import Geste from './Geste'
import { gestesMosaicQuestions, isGestesMosaicQuestion } from './GestesMosaic'
import MapBehindCTA from './MapBehindCTA'
import { Card } from './UI'
import { encodeDottedName } from './publicodes/situationUtils'

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
      <Link
        href={setSearchParams(
          {
            question: encodeDottedName(firstGestesMosaicDottedName),
          },
          'url',
        )}
      >
        Retour à la sélection des gestes
      </Link>
    <div css={`clear: both;`}>
      <h2 css={`margin-top: 0;`}>Votre sélection d'aides</h2>
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
        <a
          href="https://www.service-public.fr/particuliers/vosdroits/F35584"
          target="_blank"
        >
          service-public.fr
        </a>
        .
      </small>

      <MapBehindCTA
        {...{
          codeInsee: situation['ménage . commune']?.replace(/'/g, ''),
          searchParams,
          what: 'trouver-conseiller-renov',
          text: 'Trouver mon conseiller',
          link: 'https://france-renov.gouv.fr/preparer-projet/trouver-conseiller#trouver-un-espace-conseil-france-renov',
        }}
      />
    </div>
  )
}
