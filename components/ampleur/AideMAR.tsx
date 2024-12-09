import { Card } from '../UI'
import Value from '../Value'
import AideAmpleur from './AideAmpleur'
import checkIcon from '@/public/check.svg'

export default function AideMAR({
  engine,
  situation,
  dottedName,
  setSearchParams,
  answeredQuestions,
  rules,
  expanded,
}) {
  const rule = rules[dottedName]
  return (
    <AideAmpleur
      {...{
        engine,
        dottedName,
        setSearchParams,
        situation,
        answeredQuestions,
        level: 2,
        expanded,
      }}
    >
      {' '}
      {expanded && (
        <p>
          Votre Accompagnateur Rénov' évalue avec vous vos besoins, vous aide à
          mobiliser les aides, dont MaPrimeRénov', pour financer vos travaux et
          s'assure de leur qualité et de leur concordance par rapport à l'audit
          énergétique.
        </p>
      )}
      {expanded && (
        <>
          <h3>Comment est calculée l'aide ?</h3>
          <Card $background="#f7f8f8">
            <div
              css={`
                display: flex;
                align-items: center;
              `}
            >
              <AideMontant
                {...{
                  engine,
                  situation,
                  dottedName,
                }}
              />
            </div>
          </Card>
          <h3>Les principales conditions d'éligibilité ?</h3>
          <div
            css={`
              list-style-image: url(${checkIcon.src});
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
      )}
    </AideAmpleur>
  )
}

// "Par exemple, pour une prestation MAR à 4 000 €, x % plafonné à 2000 € soit dans votre cas xxx €
export function AideMontant({ engine, situation, dottedName }) {
  console.log(
    'indigo',
    dottedName,
    situation,
    engine
      .setSituation(situation)
      .evaluate('MPR . accompagnée . prise en charge MAR . montant'),
  )
  return (
    <section>
      <p>
        Par exemple : pour une prestation Mon Accompagnateur Rénov' de{' '}
        <Value
          {...{
            engine,
            situation,
            dottedName: dottedName + ' . prix moyen',
          }}
        />
        , en tant que ménage{' '}
        <Value
          {...{
            engine,
            situation,
            dottedName: 'ménage . revenu . classe',
            state: 'prime-black',
          }}
        />{' '}
        vous bénéficiez d'une aide de{' '}
        <Value
          {...{
            engine,
            situation,
            dottedName: dottedName + ' . pourcent',
            state: 'prime-black',
          }}
        />{' '}
        appliquée à une assiette de subvention plafonnée à{' '}
        <Value
          {...{
            engine,
            situation,
            dottedName: dottedName + ' . plafond',
            state: 'prime-black',
          }}
        />
        .
      </p>

      <p>
        Soit{' '}
        <Value
          {...{
            engine,
            situation,
            dottedName: dottedName + ' . montant',
            state: 'prime-black',
          }}
        />{' '}
        d'aide.
      </p>
    </section>
  )
}
