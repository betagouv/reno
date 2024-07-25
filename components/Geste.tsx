'use client'
import { formatValue } from 'publicodes'
import { getRuleName } from './publicodes/utils'
import GesteQuestion from './GesteQuestion'
import mprImage from '@/public/maprimerenov.svg'
import coupDePouceImage from '@/public/cee-coup-de-pouce.svg'
import Image from 'next/image'
import { BlocAide, PrimeStyle } from './UI'
import BlocAideCEE from './BlocAideCee'

export default function Geste({
  dottedName,
  answeredQuestions,
  setSearchParams,
  rules,
  engine,
  expanded,
  situation,
}) {
  let infoCEE, infoMPR, infoCP, montantTotal, isExactTotal

  const engineSituation = engine.setSituation(situation)
  const relevant = rules[dottedName + ' . MPR . barème']
    ? dottedName + ' . MPR . barème'
    : dottedName + ' . montant'
  const eligibleMPRG = engineSituation.evaluate('MPR . non accompagnée . éligible').nodeValue

  const dottedNameCee = dottedName + ' . CEE'
  if (typeof rules[dottedNameCee] !== 'undefined') {
    infoCEE = {
      montant: formatValue(
        engineSituation.evaluate(dottedNameCee + ' . montant'),
        { precision: 0 },
      ),
      titre: rules[dottedNameCee].titre,
      lien: rules[dottedNameCee].lien,
      questions: rules[dottedNameCee + ' . question']?.valeurs.map((q) =>
        rules[dottedNameCee + ' . ' + q] ? dottedNameCee + ' . ' + q : q,
      ),
    }
  }

  const dottedNameMpr = dottedName + ' . MPR'
  if (eligibleMPRG && typeof rules[dottedNameMpr] !== 'undefined') {
    infoMPR = {
      montant: formatValue(
        engineSituation.evaluate(dottedNameMpr + ' . montant'),
      ),
      plafond: formatValue(
        engineSituation.evaluate(dottedNameMpr + ' . plafond'),
      ),
      questions: dottedNameMpr + ' . ' + rules[dottedNameMpr + ' . question'],
    }
  }

  const dottedNameCP = dottedName + ' . Coup de pouce'
  if (typeof rules[dottedNameCP] !== 'undefined') {
    infoCP = {
      montant: formatValue(
        engineSituation.evaluate(dottedNameCP + ' . montant'),
      ),
      question: rules[dottedNameCP + ' . question'],
    }
  }

  const evaluationTotal = engineSituation.evaluate(dottedName + ' . montant')
  isExactTotal = Object.keys(evaluationTotal.missingVariables).length === 0
  let calculatedMontantTotal = formatValue(evaluationTotal, { precision: 0 })

  if (!isExactTotal) {
    const maximizeAideVariables = Object.keys(evaluationTotal.missingVariables)
      .map((dn) =>
        rules[dn].maximum ? { [dn]: rules[dn].maximum } : rules[dn].maximum,
      )
      .reduce((acc, obj) => ({ ...acc, ...obj }), {})
    calculatedMontantTotal = formatValue(
      engine
        .setSituation({ ...situation, ...maximizeAideVariables })
        .evaluate(engineSituation.evaluate(relevant)),
      { precision: 0 },
    )
  }

  montantTotal = calculatedMontantTotal

  const PrimeDisplay = ({ montantTotal, isExactTotal, rules, dottedName }) => (
    <>
      <div css={`margin: 0 0 0.6rem 0;`}>{rules[dottedName].titre || getRuleName(dottedName)}</div>
      <PrimeStyle $inactive={montantTotal === "Non applicable"}>
        {montantTotal === "Non applicable" ? (
          <>Prime <strong>non applicable</strong> dans votre situation</>
        ) : (
          <>{isExactTotal ? 'Prime de ' : "Jusqu'à "}<strong>{montantTotal}</strong></>
        )}
      </PrimeStyle>
    </>
  );

  if (!expanded)
    return (
      <div>
        <PrimeDisplay {...{montantTotal, isExactTotal, rules, dottedName }} />
      </div>
    )

  return (
    <details
      css={`
        summary {
          margin-bottom: 1rem;
          > div {
            margin-left: 0.6rem;
            display: inline-block;
            width: calc(100% - 50px);
            vertical-align: middle;
          }

          padding: 0.6rem 0;
        }
        > div {
          padding-top: 1rem;
          border-top: 1px solid #ddd;
          p {
            line-height: 1.4rem;
          }
        }
      `}
      open={true}
    >
      <summary>
        <div>
          <PrimeDisplay {...{montantTotal, isExactTotal, rules, dottedName }} />
        </div>
      </summary>
      {infoMPR && (
        <BlocAide>
          <div className="aide-header">
            <Image src={mprImage} alt="logo ma prime renov" width="100" />
            <div>
              <PrimeStyle>
                {'Prime de '}
                <strong>{infoMPR.montant}</strong>
              </PrimeStyle>
              <h3>MaPrimeRénov'</h3>
            </div>
          </div>
          <p className="details">
            <GesteQuestion
              {...{
                rules,
                question: infoMPR.questions,
                engine,
                situation,
                answeredQuestions,
                setSearchParams,
              }}
            />
            Conditions: La prestation doit être inférieure à{' '}
            <strong>{infoMPR.plafond}</strong>.
          </p>
        </BlocAide>
      )}
      {infoCP && (
        <BlocAide>
          <div className="aide-header">
            <Image
              src={coupDePouceImage}
              alt="logo coup de pouce"
              width="100"
            />
            <div>
              {infoCP.montant === 'Non applicable' ? (
                <>
                  <PrimeStyle $inactive={true}>
                    <strong>{infoCP.montant}</strong>
                  </PrimeStyle>
                  <span className="aide-details">
                    {' '}
                    sans {rules[infoCP.question].titre}
                  </span>
                </>
              ) : (
                <>
                  <PrimeStyle>
                    {'Prime de '}
                    <strong>{infoCP.montant}</strong>
                  </PrimeStyle>
                  <span className="aide-details">
                    {' '}
                    si {rules[infoCP.question].titre}
                  </span>
                </>
              )}
              <h3>Prime Coup de pouce</h3>
            </div>
          </div>
          <div className="aide-details">
            <GesteQuestion
              {...{
                rules,
                question: infoCP.question,
                engine,
                situation,
                answeredQuestions,
                setSearchParams,
              }}
            />
          </div>
        </BlocAide>
      )}
      {infoCEE && (
        <BlocAideCEE
          infoCEE={infoCEE}
          rules={rules}
          engine={engine}
          situation={situation}
          answeredQuestions={answeredQuestions}
          setSearchParams={setSearchParams}
        />
      )}
    </details>
  )
}