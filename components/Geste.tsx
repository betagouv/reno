'use client'
import { formatValue } from 'publicodes'
import { getRuleName } from './publicodes/utils'
import { BlocAideCEE } from './cee/BlocAideCee'
import { BlocAideCoupDePouce } from './cee/BlocAideCoupDePouce'
import { BlocAideMPR } from './mprg/BlocAideMPR'
import { PrimeStyle } from './UI'

export default function Geste({
  dottedName,
  answeredQuestions,
  setSearchParams,
  rules,
  engine,
  expanded,
  situation,
}) {
  let infoCEE, infoMPR, infoCoupDePouce, montantTotal, isExactTotal

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
      code: rules[dottedNameCee].code,
      titre: rules[dottedNameCee].titre,
      lien: rules[dottedNameCee].lien,
      questions: rules[dottedNameCee + ' . question']?.valeurs.map((q) =>
        rules[dottedNameCee + ' . ' + q] ? 
          dottedNameCee + ' . ' + q :
          (rules[dottedName + ' . ' + q] ? 
            dottedName + ' . ' + q :
            q
          )
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
      questions: [dottedNameMpr + ' . ' + rules[dottedNameMpr + ' . question']],
    }
  }

  const dottedNameCP = dottedName + ' . Coup de pouce'
  if (typeof rules[dottedNameCP] !== 'undefined') {
    infoCoupDePouce = {
      montant: formatValue(
        engineSituation.evaluate(dottedNameCP + ' . montant'),
      ),
      questions: [rules[dottedNameCP + ' . question']],
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
  // Dans le cas où l'on est éligible qu'au CEE mais pas MPR ni coup de pouce, il faut adapter la formulation
  const PrimeDisplay = ({ montantTotal, isExactTotal, rules, dottedName }) => (
    <>
      <div css={`margin: 0 0 0.6rem 0;`}>{rules[dottedName].titre || getRuleName(dottedName)}</div>
      <PrimeStyle $inactive={montantTotal === "Non applicable"}>
        {montantTotal === "Non applicable" ? (
          <>Prime <strong>non applicable</strong> dans votre situation</>
        ) : (
          (!eligibleMPRG && !infoCoupDePouce && !isExactTotal) ?
          <>Prime existante</> :
          <>{isExactTotal ? 
              (!infoCoupDePouce && !eligibleMPRG ? 'Prime indicative de ' : 'Prime de ') : 
              "Jusqu'à "
            }<strong>{montantTotal}</strong></>
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
        <BlocAideMPR
          {...{
            infoMPR,
            rules,
            engine,
            situation,
            answeredQuestions,
            setSearchParams
          }}
        />
      )}
      {infoCoupDePouce && (
        <BlocAideCoupDePouce
          {...{
            infoCoupDePouce,
            rules,
            engine,
            situation,
            answeredQuestions,
            setSearchParams
          }}
        />
      )}
      {infoCEE && (
        <BlocAideCEE
          {...{
            infoCEE,
            rules,
            engine,
            situation,
            answeredQuestions,
            setSearchParams
          }}
        />
      )}
    </details>
  )
}