'use client'

import crossIcon from '@/public/remix-close-empty.svg'
import questionIcon from '@/public/remix-question-empty.svg'
import Image from 'next/image'
import { PrimeStyle } from '@/components/UI'
import AideDurée from './AideDurée'

export const computeStatusTitle = (status) =>
  status
    ? 'Nous avons déterminé que vous êtes éligible à cette aide'
    : status === null
      ? 'Nous ne pouvons pas vous dire si vous êtes éligible à cette aide'
      : "Vous n'êtes pas éligible à cette aide"

export const AideSummary = ({
  icon,
  text,
  text2,
  type,
  status,
  value,
  expanded,
  small = false,
  engine,
  dottedName,
}) => {
  return (
    <section
      css={`
        ${small
          ? 'font-size: 85%; margin-bottom: .2rem'
          : 'margin-bottom: .6rem'}
      `}
      title={computeStatusTitle(status)}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          opacity: ${status === false ? '.65' : '1'};
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
          {status ? (
            <Image
              src={'/check-green-hybrid.svg'}
              alt={"Icône d'une coche"}
              width="10"
              height="10"
            />
          ) : status === null ? (
            <Image
              src={questionIcon}
              alt="Icône d'un point d'interrogation"
              css={``}
            />
          ) : (
            <Image
              src={crossIcon}
              alt="Icône d'une croix"
              css={`
                filter: grayscale(0.7);
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
              ${status === false && 'filter: grayscale(1)'}
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
          {text &&
            (text === "MaPrimeRénov'" ? (
              <strong css="color: var(--darkColor0)">{text}</strong>
            ) : (
              <span>{text}</span>
            ))}
          {text2 && (
            <>
              {text && <span css="color: #aaa">-</span>}
              <span>{text2}</span>
            </>
          )}
        </h4>
      </div>
      {expanded && status && (
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
            <AideDurée engine={engine} dottedName={dottedName} />
          </small>
        </div>
      )}
    </section>
  )
}