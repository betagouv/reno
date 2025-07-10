import AideAmpleur from '../ampleur/AideAmpleur'
import { createExampleSituation } from '../ampleur/AmpleurSummary'
import Input from '../Input'
import { encodeSituation } from '../publicodes/situationUtils'
import { Card } from '../UI'
import Value from '../Value'

export default function MaPrimeAdapt({
  isEligible,
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  expanded,
}) {
  const dottedName =
    'mpa . ' + situation['mpa . situation demandeur'].replaceAll('"', '') // 'mpa . occupant'

  const exampleSituation = createExampleSituation(engine, situation, false)
  const extremeSituation = createExampleSituation(engine, situation, true)

  return (
    <AideAmpleur
      {...{
        isEligible,
        engine,
        dottedName,
        setSearchParams,
        situation,
        answeredQuestions,
        exampleSituation,
        extremeSituation,
        expanded,
      }}
    >
      <h3>Comment est calculée l'aide ?</h3>
      <Card $background="#f7f8f8">
        {dottedName == 'mpa . occupant' && (
          <>
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
              dans la limite d'un plafond de travaux subventionnables de{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: dottedName + ' . montant travaux . plafond',
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
                  value={exampleSituation['mpa . montant travaux']}
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
                  HT
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
          </>
        )}
        {dottedName == 'mpa . bailleur' && (
          <>
            <p>
              Il est obligatoire de signer une convention avec l'Agence
              nationale de l'habitat (Anah) pour bénéficier de l'aide.
            </p>
            <p>
              En tant que propriétaire bailleur vous bénéficiez d'une aide de{' '}
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
                  dottedName: dottedName + ' . montant . plafond',
                  state: 'prime-black',
                }}
              />{' '}
              par logement (750€/m²{' '}
              {situation['logement . surface'] > 80 ? (
                ' limité à 80m²'
              ) : (
                <>
                  pour un logement de{' '}
                  <Value
                    {...{
                      engine,
                      situation,
                      dottedName: 'logement . surface',
                      state: 'prime-black',
                    }}
                  />
                </>
              )}
              ) .
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
                  value={exampleSituation['mpa . montant travaux']}
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
          </>
        )}
        {dottedName == 'mpa . copropriété' && (
          <>
            <p>
              En tant que syndicat de copropriété vous bénéficiez d'une aide de{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: dottedName + " . pourcentage d'aide",
                  state: 'prime-black',
                }}
              />{' '}
              avec un plafond de dépenses subventionnables de{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: dottedName + ' . montant travaux . plafond',
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
                  value={exampleSituation['mpa . montant travaux']}
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
          </>
        )}
      </Card>
    </AideAmpleur>
  )
}
