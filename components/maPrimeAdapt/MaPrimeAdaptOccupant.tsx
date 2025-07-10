import AideAmpleur from '../ampleur/AideAmpleur'
import { createExampleSituation } from '../ampleur/AmpleurSummary'
import Input from '../Input'
import { encodeSituation } from '../publicodes/situationUtils'
import { Card } from '../UI'
import Value from '../Value'

export default function MaPrimeAdaptOccupant({
  isEligible,
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  expanded,
}) {
  const dottedName = 'mpa . occupant'

  const exampleSituation = createExampleSituation(engine, situation, false)

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
        expanded,
      }}
    >
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
      </Card>
    </AideAmpleur>
  )
}
