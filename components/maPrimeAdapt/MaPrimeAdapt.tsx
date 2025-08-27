import Input from '@codegouvfr/react-dsfr/Input'
import AideAmpleur from '../ampleur/AideAmpleur'
import { createExampleSituation } from '../ampleur/AmpleurSummary'
import { encodeSituation } from '../publicodes/situationUtils'
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
      <div className="fr-callout">
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
      </div>
    </AideAmpleur>
  )
}

export const BlocMontantTravaux = ({
  engine,
  situation,
  dottedName,
  setSearchParams,
  exampleSituation,
}) => (
  <p>
    <Input
      label="Pour un montant de travaux de : "
      nativeInputProps={{
        type: 'number',
        name: 'montant-travaux',
        min: 1000,
        step: 1000,
        onChange: (rawValue) => {
          const value = +rawValue === 0 ? undefined : rawValue
          setSearchParams(
            encodeSituation({
              'mpa . montant travaux': value,
            }),
            'replace',
            false,
          )
        },
        value: exampleSituation['mpa . montant travaux'],
      }}
      addon={
        <>
          €
          <span title="Hors taxes, soit hors TVA. En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
            HT
          </span>
        </>
      }
    />
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
)
