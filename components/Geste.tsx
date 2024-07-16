'use client'
import { formatValue } from 'publicodes'
import { getRuleName } from './publicodes/utils'
import informationIcon from '@/public/information.svg'
import ceeImage from '@/public/cee-logo.png'
import mprImage from '@/public/maprimerenov-logo.svg'
import coupDePouceImage from '@/public/coup-de-pouce-logo.jpg'
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
    barème = dottedName + ' . MPR . barème',
    cee = dottedName + ' . CEE',
    mpr = dottedName + ' . MPR',
    coupDePouce = dottedName + ' . Coup de pouce'
  const relevant = rules[barème] ? barème : montant
  let montantMPR, montantCP, plafondMPR, missingVariableCP;
  let explicationCEE = ""
  let infoCEE = {};
  const engineSituation  = engine.setSituation(situation)
  if(cee in rules) {
    // TODO: Improve parsing system and make it for MPR too
    const evaluationCEE = engineSituation.evaluate(cee + ' . montant');
    //let variable = evaluationCEE.explanation.valeur.explanation.alors.explanation[0]?.condition[0].variable
    //if(variable) {
    //  explicationCEE += "avec " + variable +" = " + formatValue(engineSituation.evaluate(dottedName + ' . ' + variable))+ "<br />";
    //}
  
    // evaluationCEE.explanation.valeur.rawNode.variations?.forEach(variation => {
    //   if(typeof variation.si === 'object') {
    //     for (const [key, value] of Object.entries(variation.si)) {
    //       if (Array.isArray(value)) {
    //           explicationCEE += `Si ${key}:<br /><ul>`;
    //           value.forEach(item => {
    //             explicationCEE += `<li>${item}</li>`;
    //           });
    //           explicationCEE += `</ul>alors ${variation.alors}<br />`;
    //       }
    //     }
    //   } else {
    //     explicationCEE += variation.si ?
    //       `Si ${variation.si} alors ${variation.alors} <br />` :
    //       `Sinon ${variation.sinon}`
    //   }
    // });

    infoCEE['montant'] = formatValue(evaluationCEE, {precision: 0})
    infoCEE['missingVariable'] = Object.keys(evaluationCEE.missingVariables).map((v) => getRuleName(v))
    infoCEE['titre'] = rules[cee].titre
    infoCEE['lien'] = rules[cee].lien
  }
  if(mpr in rules) {
    montantMPR = formatValue(engineSituation.evaluate(mpr + ' . montant'))
    plafondMPR = formatValue(engineSituation.evaluate(mpr + ' . plafond'))
  }
  if(coupDePouce in rules) {
    const evaluationCP = engineSituation.evaluate(coupDePouce + ' . montant')
    montantCP = formatValue(evaluationCP, {precision: 0})
    missingVariableCP = Object.keys(evaluationCP.missingVariables).map((v) => getRuleName(v))
  }

  const evaluationTotal = engineSituation.evaluate(relevant);
  const isExactTotal = Object.keys(evaluationTotal.missingVariables).length == 0
  let montantTotal = formatValue(engineSituation.evaluate(relevant), {precision: 0})
  if(!isExactTotal) {
    const maximizeAideVariables = Object.keys(evaluationTotal.missingVariables)
                                        .map((dottedName) => {
                                          if(rules[dottedName].maximum) {
                                            return { [dottedName]: rules[dottedName].maximum }
                                          }
                                          return rules[dottedName].maximum
                                        })
                                        .reduce((acc, obj) => ({ ...acc, ...obj }), {});
    montantTotal = formatValue(engine.setSituation({ ...situation, ...maximizeAideVariables })
                                     .evaluate(relevant), 
                               {precision: 0})
  }
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
          {isExactTotal ? "Prime de " : "Jusqu'à "}<strong>{montantTotal}</strong>
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
          <div
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
          </div>
          <p>
              Remboursement de <strong>{montantMPR}</strong> si la prestation est
              inférieure à <strong>{plafondMPR}</strong>.
            </p>
        </div>
      }
      { montantCP && 
        <div>
          <div
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
            <span>Prime Coup de pouce</span>
          </div>
          <p>
              Remboursement de <strong>{montantCP}</strong> {missingVariableCP.length > 0 && "si "+ missingVariableCP}
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

      { infoCEE.montant && 
        <div>
          <div
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
            <span>CEE <small>(Plus d'infos: <a href={infoCEE.lien} target="_blank">{infoCEE.titre}</a>)</small></span>
          </div>
          {infoCEE.montant == "Non applicable" ? (<p><strong>Non applicable</strong> en cas de Prime Coup de pouce</p>) :
          (<p>
              Remboursement de <strong>{infoCEE.montant}</strong> {infoCEE.missingVariableCEE && infoCEE.missingVariableCEE.length > 0 && "(dépend de "+ infoCEE.missingVariableCEE+")"}
          </p>)}
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
