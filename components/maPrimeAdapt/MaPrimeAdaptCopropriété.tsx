import AideAmpleur from '../ampleur/AideAmpleur'
import { createExampleSituation } from '../ampleur/AmpleurSummary'
import Input from '../Input'
import { encodeSituation } from '../publicodes/situationUtils'
import { Card, Section } from '../UI'
import Value from '../Value'
import checkIcon from '@/public/check.svg'

export default function MaPrimeAdaptCopro({
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  rules,
  expanded,
}) {
  const dottedName = 'mpa . copropriété'
  const exampleSituation = createExampleSituation(engine, situation, false)
  const extremeSituation = createExampleSituation(engine, situation, true)

  return (
    <Section>
      <AideAmpleur
        {...{
          engine,
          dottedName,
          setSearchParams,
          situation,
          exampleSituation,
          extremeSituation,
          answeredQuestions,
          expanded,
        }}
      >
        <h3>Comment est calculée l'aide ?</h3>
        <Card $background="#f7f8f8">
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
        </Card>
        {expanded && (
          <>
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
    </Section>
  )
}
