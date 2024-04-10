import MarSearch from '@/app/trouver-accompagnateur-renov/MarSearch'
import Image from 'next/image'
import Link from 'next/link'
import { formatValue } from 'publicodes'
import Geste from './Geste'
import GesteQuestion from './GesteQuestion'
import { gestesMosaicQuestions, isGestesMosaicQuestion } from './GestesMosaic'
import { encodeDottedName } from './publicodes/situationUtils'
import { Card, CTA, CTAWrapper } from './UI'

export default function GestesBasket({
  rules,
  rule,
  engine,
  situation,
  answeredQuestions,
  nextQuestions,
  setSearchParams,
}) {
  const gestes = gestesMosaicQuestions.filter((q) => {
    const active = situation[q[0]] === 'oui'
    return active
  })

  const evaluation = engine
      .setSituation(situation)
      .evaluate('gestes . montant'),
    total = formatValue(evaluation)

  const missingValues = nextQuestions.find(
    (question) =>
      situation[question] == undefined &&
      question !== 'MPR . non accompagnée . confirmation',
  )

  const firstGestesMosaicDottedName = Object.entries(rules).find(
    ([dottedName, rule]) => isGestesMosaicQuestion(dottedName, rule),
  )[0]
  return (
    <div>
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
      <h2>Votre sélection d'aides</h2>
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
                {...{ dottedName: question[0], rules, engine, expanded: true }}
              />
            </Card>
          </li>
        ))}
      </ul>
      <h2>C'est parti ?</h2>
      <p>
        Vous pouvez maintenant contacter un conseiller France Rénov'. Cela ne
        vous engage à rien.
      </p>
      <MarSearch
        codeInsee={situation['ménage . commune']?.replace(/'/g, '')}
        what="trouver-conseiller-renov"
      />
      <div
        css={`
          margin-top: 3rem;
        `}
      >
        <p>
          Si votre conseiller France Rénov' ne s'affiche pas sur la carte
          ci-dessus, cliquez sur le bouton suivant :
        </p>
        <CTAWrapper>
          <CTA>
            {' '}
            <Link href="https://france-renov.gouv.fr/preparer-projet/trouver-conseiller#trouver-un-espace-conseil-france-renov">
              <span
                css={`
                  img {
                    filter: invert(1);
                    width: 1.6rem;
                    margin-right: 0.6rem;
                    height: auto;
                    vertical-align: bottom;
                  }
                `}
              >
                <Image
                  src="/check.svg"
                  width="10"
                  height="10"
                  alt="Icône coche pleine"
                />
                Trouver mon conseiller
              </span>
            </Link>
          </CTA>
        </CTAWrapper>
      </div>
    </div>
  )
}
