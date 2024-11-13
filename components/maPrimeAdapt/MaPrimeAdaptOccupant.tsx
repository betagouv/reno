import AideAmpleur from '../ampleur/AideAmpleur'
import Input from '../Input'
import { encodeSituation } from '../publicodes/situationUtils'
import { Card } from '../UI'
import Value from '../Value'
import checkIcon from '@/public/check.svg'

export default function MaPrimeAdaptOccupant({
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  exampleSituation,
  rules,
  expanded,
}) {
  const dottedName = 'mpa . occupant'

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
      {' '}
      {expanded && (
        <>
          <p>
            Votre Accompagnateur Rénov' évalue avec vous vos besoins, vous aide
            à mobiliser les aides, dont MaPrimeRénov', pour financer vos travaux
            et s'assure de leur qualité et de leur concordance par rapport à
            l'audit énergétique.
          </p>
          <h3>Comment est calculée l'aide ?</h3>
          <Card $background="#f7f8f8">
            <p>
              En tant que ménage{' '}
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
                  dottedName: dottedName + " . pourcentage d'aide",
                  state: 'prime-black',
                }}
              />{' '}
              plafonnée à{' '}
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
              Pour un montant de travaux de{' '}
              <label>
                <Input
                  css={`
                    vertical-align: text-bottom;
                    padding: 0.2rem 0.3rem 0 0;
                    max-width: 6rem !important;
                  `}
                  autoFocus={false}
                  value={exampleSituation['projet . travaux']}
                  min="1000"
                  onChange={(rawValue) => {
                    const value = +rawValue === 0 ? undefined : rawValue
                    setSearchParams(
                      encodeSituation({
                        [`mpa . montant travaux`]: value,
                      }),
                      'replace',
                      false,
                    )
                  }}
                  step="1000"
                  css={`
                    border-bottom: 2px solid #d1d1fb !important;
                  `}
                />
                €{' '}
                <span title="Hors taxes, soit hors TVA. En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
                  HT.
                </span>
              </label>
              , je peux bénéficier de{' '}
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
