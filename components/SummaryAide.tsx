'use client'

import Image from 'next/image'
import { Label } from './Label'
import checkIcon from '@/public/check-green.svg'
import crossIcon from '@/public/remix-close-empty.svg'
import { formatValue } from 'publicodes'
import { PrimeStyle } from './Geste'

export const SummaryAide = ({
  icon,
  text,
  text2,
  engine,
  situation,
  dottedName,
}) => {
  const evaluation = engine.setSituation(situation).evaluate(dottedName)
  const value = formatValue(evaluation, { precision: 0 })

  const applicable = !(
    value === 'Non applicable' ||
    evaluation.nodeValue === 0 ||
    value === 'non'
  )

  return (
    <section
      css={`
        margin-bottom: 0.6rem;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          opacity: ${applicable ? '1' : '.75'};
        `}
      >
        <span
          css={`
            display: flex;
            align-items: center;
            img {
              width: 1.4rem;
              height: auto;
              vertical: middle;
              margin-right: 0.4rem;
            }
          `}
        >
          {applicable ? (
            <Image src={checkIcon} alt={"Icône d'une coche"} />
          ) : (
            <Image src={crossIcon} alt="Icône d'une croix" />
          )}
        </span>
        <h4
          css={`
            font-weight: 400;
            margin: 0;
            font-size: 100%;
            span {
              margin: 0 0.2rem;
            }
            display: inline-flex;
            align-items: center;
            img {
              margin-right: 0.2rem;
              ${!applicable && 'filter: grayscale(1)'}
            }
          `}
        >
          <Image
            src={`/${icon}`}
            alt={`Icône ${text}`}
            width="25"
            height="25"
          />
          <span>{text}</span>
          <span>{text2}</span>
        </h4>
      </div>
      <div
        css={`
          display: flex;
          justify-content: end;
        `}
      >
        {applicable && (
          <small
            css={`
              display: flex;
              align-items: center;
              span {
                margin: 0 0.15rem;
              }
            `}
          >
            <span>jusqu'à </span>
            <PrimeStyle $inactive={false}>{value}</PrimeStyle>
          </small>
        )}
      </div>
    </section>
  )
}
