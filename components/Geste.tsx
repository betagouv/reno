'use client';
import { formatValue } from 'publicodes';
import { getRuleName } from './publicodes/utils';
import GesteQuestion from './GesteQuestion';
import informationIcon from '@/public/information.svg';
import ceeImage from '@/public/cee-logo.png';
import mprImage from '@/public/maprimerenov-logo.svg';
import coupDePouceImage from '@/public/coup-de-pouce-logo.jpg';
import Image from 'next/image';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

export default function Geste({
  dottedName,
  answeredQuestions,
  setSearchParams,
  rules,
  engine,
  expanded,
  situation
}) {
  const [infoCEE, setInfoCEE] = useState({});
  const [infoMPR, setInfoMPR] = useState({});
  const [infoCP, setInfoCP] = useState({});
  const [montantTotal, setMontantTotal] = useState(null);
  const [isExactTotal, setIsExactTotal] = useState(false);

  useEffect(() => {
    const engineSituation = engine.setSituation(situation);
    const relevant = rules[dottedName + ' . MPR . barème'] ? dottedName + ' . MPR . barème' : dottedName + ' . montant'

    const dottedNameCee = dottedName + ' . CEE';
    if (typeof rules[dottedNameCee] !== "undefined") {
      setInfoCEE({
        montant: formatValue(engineSituation.evaluate(dottedNameCee + ' . montant'), { precision: 0 }),
        titre: rules[dottedNameCee].titre,
        lien: rules[dottedNameCee].lien,
        questions: rules[dottedNameCee + ' . question']?.valeurs.map(
          (q) => (rules[dottedNameCee + ' . ' + q] ? dottedNameCee + ' . ' + q : q)
        )
      });
    }

    const dottedNameMpr = dottedName + ' . MPR';
    if (typeof rules[dottedNameMpr] !== "undefined") {
      setInfoMPR({
        montant: formatValue(engineSituation.evaluate(dottedNameMpr + ' . montant')),
        plafond: formatValue(engineSituation.evaluate(dottedNameMpr + ' . plafond')),
        questions: dottedNameMpr + ' . ' + rules[dottedNameMpr +  ' . question']
      })
    }

    const dottedNameCP = dottedName + ' . Coup de pouce'
    if (typeof rules[dottedNameCP] !== "undefined") {
      setInfoCP({
        montant: formatValue(engineSituation.evaluate(dottedNameCP + ' . montant')),
        question: rules[dottedNameCP + ' . question']
      })
    }

    const evaluationTotal = engineSituation.evaluate(dottedName + ' . montant');
    setIsExactTotal(Object.keys(evaluationTotal.missingVariables).length === 0);
    let calculatedMontantTotal = formatValue(evaluationTotal, { precision: 0 });

    if (!isExactTotal) {
      const maximizeAideVariables = Object.keys(evaluationTotal.missingVariables)
        .map((dn) => (rules[dn].maximum ? { [dn]: rules[dn].maximum } : rules[dn].maximum))
        .reduce((acc, obj) => ({ ...acc, ...obj }), {});
      calculatedMontantTotal = formatValue(engine.setSituation({ ...situation, ...maximizeAideVariables }).evaluate(engineSituation.evaluate(relevant)), { precision: 0 });
    }

    setMontantTotal(calculatedMontantTotal);
  }, [dottedName, engine, situation, rules, isExactTotal]);
  if (!expanded)
    return (
      <div>
        <div css={`margin: 0 0 0.6rem 0;`}>
          {rules[dottedName].titre || getRuleName(dottedName)}
        </div>
        <PrimeStyle>
          {isExactTotal ? "Prime de " : "Jusqu'à "}
          <strong>{montantTotal}</strong>
        </PrimeStyle>
      </div>
    );

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
          <div>{rules[dottedName].titre || getRuleName(dottedName)}</div>
          <PrimeStyle>
            {isExactTotal ? "Prime de " : "Jusqu'à "}
            <strong>{montantTotal}</strong>
          </PrimeStyle>
        </div>
      </summary>
      {infoMPR.montant && (
        <BlocAide>
          <div className="aide-header">
            <div>
              <Image src={mprImage} alt="logo ma prime renov" width="100" />
            </div>
            <div>
              <PrimeStyle>
                {"Prime de "}
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
            Conditions: La prestation doit être inférieure à <strong>{infoMPR.plafond}</strong>.
          </p>
        </BlocAide>
      )}
      {infoCP.question && (
        <BlocAide>
          <div className="aide-header">
            <div>
              <Image src={coupDePouceImage} alt="logo coup de pouce" width="100" />
            </div>
            <div>
              {infoCP.montant === "Non applicable" ? (
                <>
                  <PrimeStyle $inactive={true}>
                    <strong>{infoCP.montant}</strong>
                  </PrimeStyle>
                  <span className="aide-details"> sans {rules[infoCP.question].titre}</span>
                </>
              ) : (
                <>
                  <PrimeStyle>
                    {"Prime de "}
                    <strong>{infoCP.montant}</strong>
                  </PrimeStyle>
                  <span className="aide-details"> si {rules[infoCP.question].titre}</span>
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
      {infoCEE.montant && (
        <BlocAide>
          <div className="aide-header">
            <div>
              <Image src={ceeImage} alt="logo Cee" width="100" />
            </div>
            <div>
              {infoCEE.montant === "Non applicable" ? (
                <>
                  <PrimeStyle $inactive={true}>
                    <strong>Non applicable</strong>
                  </PrimeStyle>
                  <span className="aide-details"> (non cumulable avec la Prime Coup de pouce)</span>
                </>
              ) : (
                <PrimeStyle>
                  {"Prime minimum de "}
                  <strong>{infoCEE.montant}</strong>
                </PrimeStyle>
              )}
              <h3>
                Prime CEE (Certificats d'Économie d'Énergie)
                <br />
                <small css={`color: #666; font-size: 0.6em; font-weight: 500;`}>
                  Plus d'infos: <a href={infoCEE.lien} target="_blank">{infoCEE.titre}</a>
                </small>
              </h3>
            </div>
          </div>
          <div className="aide-details">
            {infoCEE.questions?.map((question, idx) => (
              <GesteQuestion
                key={idx}
                {...{
                  rules,
                  question,
                  engine,
                  situation,
                  answeredQuestions,
                  setSearchParams,
                }}
              />
            ))}
          </div>
        </BlocAide>
      )}
    </details>
  );
}

const BlocAide = styled.div`
  text-align: left;
  padding: 1.5rem 1.5rem 1.75rem;
  border: 1px solid #ddd;
  border-bottom: 3px solid #000091;
  margin-bottom: 0.5rem;
  .aide-header {
    display: flex;
    align-items: center;
    color: #2a82dd;
    font-weight: 500;
  }
  img {
    margin-right: 1rem;
  }
  h3 {
    color: #000091;
    margin: 1rem 0rem;
  }
  .aide-details {
    font-size: 0.75rem;
    line-height: 1.25rem;
    color: #3a3a3a;
  }
`;

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
`;