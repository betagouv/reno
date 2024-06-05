'use client'

import checkIcon from '@/public/check-green.svg'
import crossIcon from '@/public/remix-close-empty.svg'
import Image from 'next/image'
import { PrimeStyle } from './Geste'

export const SummaryAide = ({
  icon,
  text,
  text2,
  type,
  eligible,
  value,
  expanded,
}) => {
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
          opacity: ${eligible ? '1' : '.75'};
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
          {eligible ? (
            <Image src={checkIcon} alt={"Icône d'une coche"} />
          ) : (
            <Image
              src={crossIcon}
              alt="Icône d'une croix"
              css={`
                filter: grayscale(1);
              `}
            />
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
              margin-right: 0.1rem;
              ${!eligible && 'filter: grayscale(1)'}
            }
          `}
        >
          {' '}
          {false && (
            <Image
              src={`/${icon}`}
              alt={`Icône ${text}`}
              width="25"
              height="25"
            />
          )}
          <span>{text}</span>
          <span css="color: #aaa">-</span>
          <span>{text2}</span>
        </h4>
      </div>
      <div
        css={`
          display: flex;
          justify-content: end;
        `}
      >
        {expanded && eligible && (
          <small
            css={`
              display: flex;
              align-items: center;
              span {
                margin: 0 0.15rem;
              }
            `}
          >
            <span>{type} jusqu'à </span>
            <PrimeStyle $dashed={type === 'prêt'}>{value}</PrimeStyle>
          </small>
        )}
      </div>
    </section>
  )
}
