'use client'
import { formatValue } from 'publicodes'
import { getRuleName } from './publicodes/utils'
import informationIcon from '@/public/information.svg'
import Image from 'next/image'
import styled from 'styled-components'

export default function Geste({
  dottedName,
  rules,
  engine,
  expanded,
  situation,
  inactive,
}) {
  const questionRule = rules[dottedName]
  const montant = dottedName + ' . montant',
    barème = dottedName + ' . barème',
    cee = dottedName + ' . CEE',
    mpr = dottedName + ' . MPR'
  const relevant = rules[barème] ? barème : montant
  let montantCEE, montantMPR, plafondMPR, missingVariableCEE;
  let explicationCEE = ""

  const engineSituation  = engine.setSituation(situation)
  if(cee in rules) {
    // TODO: Improve parsing system and make it for MPR too
    const evaluationCEE = engineSituation.evaluate(cee + ' . montant');
    let variable = evaluationCEE.explanation.valeur.explanation.alors.explanation[0]?.condition[0].variable
    if(variable) {
      explicationCEE += "avec " + variable +" = " + formatValue(engineSituation.evaluate(dottedName + ' . ' + variable))+ "<br />";
    }
    evaluationCEE.explanation.valeur.rawNode.variations?.forEach(variation => {
      if(typeof variation.si === 'object') {
        for (const [key, value] of Object.entries(variation.si)) {
          if (Array.isArray(value)) {
              explicationCEE += `Si ${key}:<br /><ul>`;
              value.forEach(item => {
                explicationCEE += `<li>${item}</li>`;
              });
              explicationCEE += `</ul>alors ${variation.alors}<br />`;
          }
        }
      } else {
        explicationCEE += variation.si ?
          `Si ${variation.si} alors ${variation.alors} <br />` :
          `Sinon ${variation.sinon}`
      }
    });

    montantCEE = formatValue(evaluationCEE)
    missingVariableCEE = Object.keys(evaluationCEE.missingVariables).map((v) => getRuleName(v))
  }
  if(mpr in rules) {
    montantMPR = formatValue(engineSituation.evaluate(mpr + ' . montant'))
    plafondMPR = formatValue(engineSituation.evaluate(mpr + ' . plafond'))
  }

  const montantTotal = formatValue(engineSituation.evaluate(relevant))

  if (!expanded)
    return (
      <div>
        <div
          css={`
            margin: 0 0 0.6rem 0;
          `}
        >
          {questionRule.titre || getRuleName(dottedName)}
        </div>
        <PrimeStyle $inactive={inactive}>
          Prime de <strong>{montantTotal}</strong>
        </PrimeStyle>
      </div>
    )
  return (
    <details
      css={`
        summary {
          > div {
            margin-left: 0.6rem;
            display: inline-block;
            width: calc(100% - 50px);
            vertical-align: middle;
            > div {
              margin: 0 0 0.6rem 0;
            }
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
          <div>{questionRule.titre || getRuleName(dottedName)}</div>
          <Prime value={`${montantTotal}`} inactive={inactive} />
        </div>
      </summary>

      { montantMPR && 
        <div>
          <span
            css={`
              display: flex;
              align-items: center;
              margin-bottom: 0.8rem;
              color: #2a82dd;
              font-weight: 500;
            `}
          >
            <Image
              src={informationIcon}
              alt="infobulle"
              width="25"
              css={`
                margin-right: 0.4rem;
              `}
            />{' '}
            <span>Conditions MPR</span>
          </span>
          <p>
              Remboursement de <strong>{montantMPR}</strong> si la prestation est
              inférieure à <strong>{plafondMPR}</strong>.
            </p>
        </div>
      }

      { montantCEE && 
        <div>
          <span
            css={`
              display: flex;
              align-items: center;
              margin-bottom: 0.8rem;
              color: #2a82dd;
              font-weight: 500;
            `}
          >
            <Image
              src={informationIcon}
              alt="infobulle"
              width="25"
              css={`
                margin-right: 0.4rem;
              `}
            />{' '}
            <span>Conditions CEE</span>
          </span>
          <p>
              Remboursement de <strong>{montantCEE}</strong> {missingVariableCEE.length > 0 && "si "+ missingVariableCEE}
          </p>
          {explicationCEE && 
            <div>
              <div css={`
                margin-bottom: 0.4rem;
              `}><strong>Explications:</strong></div>
              <p dangerouslySetInnerHTML={{
                __html: explicationCEE
              }}>
              </p>
            </div>
          }
        </div>
      }
    </details>
  )
}

export const PrimeStyle = styled.span`
  color: #356e3e;
  background: #bef2c5;
  border: 1px solid #356e3e4d;
  padding: 0.1rem 0.4rem 0.05rem;
  border-radius: 0.2rem;
  white-space: nowrap;
  width: fit-content;
  text-align: center;
  ${(p) => p.$inactive && `background: #eee; color: #666`}
  ${(p) =>
    p.$dashed &&
    `border-style: dashed !important; background: #ecf6ee !important`}
  ${(p) =>
    p.$secondary &&
    `background: transparent; border: none; em {font-weight: 500;text-decoration: underline solid #49c75d}; border-radius: 0; padding: 0`}
`
export const Prime = ({ value, type, inactive = false }) => (
  <PrimeStyle $inactive={inactive}>
    <strong>{value}</strong>
  </PrimeStyle>
)
