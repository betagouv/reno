import DPEScenario from '@/components/mpra/DPEScenario'
import AideAmpleur from './AideAmpleur'
import { Card, CTA } from '../UI'
import rules from '@/app/règles/rules'
import checkIcon from '@/public/check-square.png'
import Value from '../Value'
import DPELabel from '../DPELabel'
import { Key } from '../explications/ExplicationUI'
import { Écrêtement } from '@/components/explications/Écrêtement'
import Image from 'next/image'
import Link from 'next/link'
import { encodeSituation } from '../publicodes/situationUtils'
export default function MPRA({
  setSearchParams,
  answeredQuestions,
  engine,
  situation,
  exampleSituation,
  expanded,
}) {
  const dottedName = 'MPR . accompagnée'
  const value = situation['projet . DPE visé'],
    oldIndex = +situation['DPE . actuel'] - 1,
    automaticChoice = Math.max(oldIndex - 2, 0),
    choice = value ? Math.min(automaticChoice, value - 1) : automaticChoice

  return (
    <AideAmpleur
      {...{
        engine,
        dottedName,
        setSearchParams,
        situation,
        answeredQuestions,
        expanded,
      }}
    >
      <>
        <DPEScenario
          {...{
            rules,
            choice,
            oldIndex,
            engine,
            situation,
            setSearchParams,
            answeredQuestions,
            exampleSituation,
          }}
        />
        <Card
          css={`
            background: #f4efff;
            h3 {
              margin: 0.5rem 0;
            }
          `}
        >
          <h3>
            <span aria-hidden="true">🔎</span> Un audit énergétique nécessaire
            pour MaPrimeRénov'
          </h3>
          <p>
            Obligatoire, avec une aide partielle pour le financer, cet audit est
            essentiel pour définir un projet adapté et maximiser vos aides.
          </p>
          <p>
            <strong>Coût moyen</strong> : Entre <strong>2 000 €</strong> et{' '}
            <strong>4 000 €</strong> (selon votre situation).
          </p>
          <p
            css={`
              margin-bottom: 1rem;
            `}
          >
            <strong>Aides disponibles</strong> : Une prise en charge partielle
            allant jusqu'à{' '}
            <Value
              {...{
                engine,
                situation,
                state: 'prime',
                dottedName: 'MPR . accompagnée . prise en charge MAR . montant',
              }}
            />{' '}
            d'aides.
          </p>
          <CTA $fontSize="normal" $importance="emptyBackground">
            <Link
              href={setSearchParams(
                {
                  ...encodeSituation(
                    {
                      ...situation,
                      ['details']: 'MPR.accompagnée.prise en charge MAR',
                    },
                    false,
                    answeredQuestions,
                  ),
                },
                'url',
                true,
              )}
            >
              En savoir plus sur l'aide ➞
            </Link>
          </CTA>
        </Card>
        {/* <h3>Comment est calculée l'aide ?</h3>
              <p>
                Une bonification de <Key state="prime-black">10 %</Key> s'ajoute
                à ce taux si votre logement est une passoire énergétique
                (logements avec une étiquette <DPELabel index="5" /> ou{' '}
                <DPELabel index="6" />) et que le programme de travaux vous
                permet d’atteindre une étiquette <DPELabel index="3" /> au
                minimum.
              </p>
              <Écrêtement {...{ engine, rules, situation }} /> */}
        <h3>Les principales conditions d'éligibilité ?</h3>
        <div
          css={`
            list-style-image: url(${checkIcon.src});
            list-style-position: inside;
            ul {
              padding: 0;
            }
            li {
              margin: 1rem 0;
              ul {
                list-style-image: none;
              }
            }
          `}
          dangerouslySetInnerHTML={{
            __html: rules[dottedName].conditionsEligibilitesHTML,
          }}
        />
      </>
    </AideAmpleur>
  )
}
