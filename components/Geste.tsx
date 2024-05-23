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
    barème = dottedName + ' . barème'

  const relevant = rules[barème] ? barème : montant

  const montantValue = formatValue(
    engine.setSituation(situation).evaluate(relevant),
  ).replace('m2', 'm²')

  const plafond = dottedName + ' . plafond',
    plafondValue = formatValue(engine.setSituation(situation).evaluate(plafond))

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
          Prime de <strong>{montantValue}</strong>
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
          <Prime value={`${montantValue}`} inactive={inactive} />
        </div>
      </summary>

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
            width="25"
            css={`
              margin-right: 0.4rem;
            `}
          />{' '}
          <span>Conditions</span>
        </span>
        <p>
          Remboursement de <strong>{montantValue}</strong> si la prestation est
          inférieure à <strong>{plafondValue}</strong>.
        </p>
      </div>
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
  width: 4.5rem;
  text-align: center;
  ${(p) => p.$inactive && `background: #eee; color: #666`}
  ${(p) =>
    p.$dashed &&
    `border-style: dashed !important; background: #e4f3e6 !important`}
  ${(p) =>
    p.$secondary &&
    `background: transparent; border: none; em {font-weight: 500;text-decoration: underline solid #49c75d}; border-radius: 0; padding: 0`}
`
export const Prime = ({ value, inactive = false }) => (
  <PrimeStyle $inactive={inactive}>
    <strong>{value}</strong>
  </PrimeStyle>
)
