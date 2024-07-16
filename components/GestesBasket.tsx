import MarSearch from '@/app/trouver-accompagnateur-renov/MarSearch'
import Link from 'next/link'
import { formatValue } from 'publicodes'
import Geste from './Geste'
import { gestesMosaicQuestions, isGestesMosaicQuestion } from './GestesMosaic'
import { encodeDottedName } from './publicodes/situationUtils'
import { Card } from './UI'

export default function GestesBasket({
  rules,
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
                {...{
                  dottedName: question[0],
                  rules,
                  engine,
                  situation,
                  answeredQuestions,
                  nextQuestions,
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
      <MarSearch
        codeInsee={situation['ménage . commune']?.replace(/'/g, '')}
        what="trouver-conseiller-renov"
      />
    </div>
  )
}
