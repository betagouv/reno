'use client'

import crossIcon from '@/public/remix-close-empty.svg'
import Image from 'next/image'
import { PrimeStyle } from './UI'

export const SummaryAide = ({
  icon,
  text,
  text2,
  type,
  eligible,
  value,
  expanded,
  small = false,
}) => {
  return (
    <section
      css={`
        ${small
          ? 'font-size: 85%; margin-bottom: .2rem'
          : 'margin-bottom: .6rem'}
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
            <Image
              src={'/check-green-hybrid.svg'}
              alt={"Icône d'une coche"}
              width="10"
              height="10"
            />
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
          {false && (
            <Image
              src={`/${icon}`}
              alt={`Icône ${text}`}
              width="25"
              height="25"
            />
          )}
          <span>{text}</span>
          {text2 && (
            <>
              <span css="color: #aaa">-</span>
              <span>{text2}</span>
            </>
          )}
        </h4>
      </div>
      {expanded && eligible && (
        <div
          css={`
            display: flex;
            justify-content: end;
          `}
        >
          {' '}
          <span
            css={`
              border-bottom: 1px dashed #ddd;
              flex-grow: 1;
              margin: 0 1rem 0.7rem 2rem;
              display: none; /* not convinced by this, to iterate*/
            `}
          ></span>
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
            <PrimeStyle
              $dashed={type === 'prêt'}
              css={
                type === 'prêt'
                  ? `
                background: #d2eafc !important;
				color: #216090; border-color: #98b5cb; 
              `
                  : ''
              }
            >
              {value}
            </PrimeStyle>
          </small>
        </div>
      )}
    </section>
  )
}
