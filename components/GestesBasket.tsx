import MarSearch from '@/app/trouver-accompagnateur-renov/MarSearch'
import Image from 'next/image'
import Link from 'next/link'
import { formatValue } from 'publicodes'
import { BlocQuestionRéponse } from './BlocQuestionRéponse'
import Geste from './Geste'
import GesteQuestion from './GesteQuestion'
import { gestesMosaicQuestions, isGestesMosaicQuestion } from './GestesMosaic'
import { encodeDottedName } from './publicodes/situationUtils'
import { Value } from './ScenariosSelector'
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
      <h2>Votre panier de gestes</h2>
      <ul
        css={`
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
              <GesteQuestion
                {...{
                  dottedName: question[0],
                  rules,
                  nextQuestions,
                  engine,
                  situation,
                  answeredQuestions,
                  setSearchParams,
                }}
              />
            </Card>
          </li>
        ))}
      </ul>
      <div>
        <p
          css={`
            visibility: ${missingValues ? 'visible' : 'hidden'};
            text-align: right;
          `}
        >
          💡 Répondez aux questions ci-dessus pour obtenir une estimation de
          l'aide totale.
        </p>
        <div
          css={`
            margin-top: 0.6rem;
            position: sticky;
            top: 2rem;
            > div {
              text-align: center;
              border: 2px solid #7eb48f;
              padding: 0.2rem 0.4rem;
              background: #c4fad5;
              width: 10rem;
              margin: 0;
              margin-left: auto;
            }
          `}
        >
          <div>Estimation totale {missingValues ? '...' : ` ~ ${total}`}</div>
        </div>
      </div>
      <BlocQuestionRéponse>
        <details>
          <summary open={false}>Y a-t-il un montant maximum d'aides ?</summary>

          <p>
            Le montant cumulé de MaPrimeRénov’, des aides des fournisseurs
            d’énergie et des aides versées par la Commission de régulation de
            l’énergie en Outre-mer ne peut pas dépasser, pour votre ménage de
            classe de revenu{' '}
            <Value
              {...{
                engine,
                situation: { ...situation },
                dottedName: 'ménage . revenu . classe',
                state: 'emphasize',
              }}
            />
            , un maximum de{' '}
            <Value
              {...{
                engine,
                situation: { ...situation },
                dottedName: "MPR . non accompagnée . pourcentage d'écrêtement",
                state: 'emphasize',
              }}
            />{' '}
            de la dépense éligible.
          </p>
          <p>
            Le montant cumulé de MaPrimeRenov’ et de toutes les aides publiques
            et privées perçues ne peut pas dépasser 100 % de la dépense éligible
            après remise, ristourne ou rabais des entreprises.
          </p>
          <p>
            Cette règle est appellée <em>écrêtement</em>.
          </p>
        </details>
        <details>
          <summary open={false}>
            Avec quelles professionnels puis-je bénéficier de ces primes ?
          </summary>
          <p>
            Les entreprises qui feront les travaux{' '}
            <strong>
              doivent être{' '}
              <a
                href="https://www.ecologie.gouv.fr/label-reconnu-garant-lenvironnement-rge"
                target="_blank"
              >
                certifiées RGE
              </a>
            </strong>{' '}
            pour que vous puissiez rentrer dans le parcours MaPrimeRénov' et
            bénéficier des primes ci-dessus.
          </p>
        </details>
        <details>
          <summary open={false}>Les montants incluent-ils la pose ?</summary>
          <p>
            Oui. La dépense éligible correspond au coût du matériel, pose
            comprise.
          </p>
        </details>
      </BlocQuestionRéponse>
      <h2>C'est parti ?</h2>
      <p>
        Vous pouvez maintenant contacter un conseiller France Rénov'. Cela ne
        vous engage à rien.
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
      <MarSearch codeInsee={situation['ménage . commune']?.replace(/'/g, '')} />
    </div>
  )
}
