import Input from '@codegouvfr/react-dsfr/Input'
import AideAmpleur from '../ampleur/AideAmpleur'
import { createExampleSituation } from '../ampleur/AmpleurSummary'
import { encodeDottedName } from '../publicodes/situationUtils'
import Value from '../Value'
import { formatNumberWithSpaces } from '../utils'
import { push } from '@socialgouv/matomo-next'
import CalculatorWidget from '../CalculatorWidget'
import rules from '@/app/règles/rules'
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons'
import Badge from '@codegouvfr/react-dsfr/Badge'

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
  const accompagnement = 'mpa . occupant . accompagnement'
  const exampleSituation = createExampleSituation(situation)
  const extremeSituation = createExampleSituation(situation, 'best')

  return (
    <AideAmpleur
      {...{
        isEligible,
        engine,
        dottedName: 'mpa',
        setSearchParams,
        situation,
        answeredQuestions,
        exampleSituation,
        extremeSituation,
        expanded,
      }}
    >
      <h3>Comment est calculée l'aide ?</h3>
      <CalculatorWidget>
        {dottedName == 'mpa . occupant' && (
          <>
            <p>
              En tant que ménage{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: 'ménage . revenu . classe',
                  state: 'normal',
                }}
              />{' '}
              vous bénéficiez d'une aide de{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: dottedName + " . pourcentage d'aide",
                  state: 'normal',
                }}
              />{' '}
              dans la limite d'un plafond de travaux subventionnables de{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: dottedName + ' . montant travaux . plafond',
                  state: 'normal',
                }}
              />
              .
            </p>
            <BlocMontantTravaux
              {...{
                engine,
                situation,
                exampleSituation,
                dottedName,
                setSearchParams,
              }}
            />
            <div className="fr-highlight fr-my-5v">
              De plus, en tant que propriétaire occupant ou locataire, vous avez
              droit à une avance de{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: 'mpa . occupant . avance',
                }}
              />{' '}
              du montant de l’aide.
            </div>
            <RadioButtons
              legend={rules[accompagnement]['question'] + ' : '}
              hintText={rules[accompagnement]['description']}
              options={rules[accompagnement]['une possibilité parmi'][
                'possibilités'
              ].map((i) => ({
                label: (
                  <div>
                    {rules[`${accompagnement} . ${i}`].titre}{' '}
                    <Badge
                      noIcon
                      severity={situation[accompagnement] === i && 'success'}
                    >
                      {rules[`${accompagnement} . ${i}`].montant}
                    </Badge>
                  </div>
                ),
                hintText: (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: rules[`${accompagnement} . ${i}`].description,
                    }}
                  />
                ),
                nativeInputProps: {
                  value: i,
                  checked: situation[accompagnement] === i,
                  onChange: () => {
                    push([
                      'trackEvent',
                      'MPA',
                      'Interaction',
                      'type accompagement',
                    ])

                    setSearchParams({
                      [encodeDottedName(accompagnement)]: i + '*',
                    })
                  },
                },
              }))}
              stateRelatedMessage=""
            />
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
                  state: 'normal',
                }}
              />{' '}
              plafonnée à{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: dottedName + ' . montant . plafond',
                  state: 'normal',
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
                    }}
                  />
                </>
              )}
              ) .
            </p>
            <BlocMontantTravaux
              {...{
                engine,
                situation,
                exampleSituation,
                dottedName,
                setSearchParams,
              }}
            />
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
            <BlocMontantTravaux
              {...{
                engine,
                situation,
                exampleSituation,
                dottedName,
                setSearchParams,
              }}
            />
          </>
        )}
      </CalculatorWidget>
    </AideAmpleur>
  )
}

export const BlocMontantTravaux = ({
  engine,
  situation,
  dottedName,
  setSearchParams,
  exampleSituation,
  rule = 'mpa . montant travaux',
}) => (
  <div className="fr-grid-row fr-grid-row--center fr-my-5v">
    <div
      css={`
        text-align: center;
        div {
          justify-content: center;
        }
      `}
      className="fr-col"
    >
      <Input
        label="Montant estimé des travaux : "
        nativeInputProps={{
          pattern: '\d+',
          type: 'text',
          inputMode: 'numeric',
          onChange: (e) => {
            const price = e.target.value.replace(/\s/g, '')
            const invalid = price != '' && (isNaN(price) || price <= 0)
            if (invalid) return

            push([
              'trackEvent',
              rule,
              'Interaction',
              'montant travaux ' + price,
            ])
            setSearchParams({
              [encodeDottedName(rule)]: price == '' ? undefined : price + '*',
            })
          },
          value: exampleSituation[rule]
            ? formatNumberWithSpaces(exampleSituation[rule])
            : '',
        }}
        addon={
          <>
            <span title="Hors taxes, soit hors TVA. En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
              € HT
            </span>
          </>
        }
      />
    </div>
    <div style={{ textAlign: 'center' }} className="fr-col">
      Montant de l'aide : <br />
      <Value
        {...{
          engine,
          situation,
          dottedName: dottedName + ' . montant',
          className: 'fr-mt-2v',
          size: 'xl',
        }}
      />
    </div>
  </div>
)
