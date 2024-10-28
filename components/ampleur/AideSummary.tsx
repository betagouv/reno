'use client'

import { PrimeStyle } from '@/components/UI'
import { PrimeWithLabel } from './AideAmpleur'
import StatusIcon from './StatusIcon'

export const computeStatusTitle = (status) =>
  status
    ? 'Nous avons déterminé que vous êtes éligible à cette aide.'
    : status === null
      ? 'Nous ne pouvons pas encore vous dire si vous êtes éligible à cette aide.'
      : "Vous n'êtes pas éligible à cette aide"

export const AideSummary = ({
  text,
  text2,
  status,
  expanded,
  evaluation,
  engine,
  situation,
  dottedName,
}) => {
  return (
    <>
      <h4
        css={`
          ${!status && 'display: flex'};
          align-items: center;
          opacity: ${!status ? '.65' : '1'};
          font-weight: 400;
          margin: 0 0 0.2rem 0;
          font-size: 100%;
        `}
      >
        {!status && (
          <span
            css={`
              display: flex;
              align-items: center;
              img {
                filter: grayscale(1);
                width: 1.4rem;
                height: auto;
                vertical: middle;
                margin-right: 0.4rem;
              }
            `}
          >
            <StatusIcon status={status} />
          </span>
        )}
        {text && <span>{text}</span>}
        {text2 && (
          <>
            {text && (
              <span
                css="
                    display: inline-block; 
                    margin: 0 0.25rem;
                    color: #aaa;"
              >
                -
              </span>
            )}
            {text2}
          </>
        )}
      </h4>
      {expanded &&
        (status ? (
          <div
            css={`
              display: flex;
              justify-content: start;
              margin-bottom: 0.8rem;
            `}
          >
            <PrimeWithLabel
              css={`
                font-size: 90%;
                margin-top: 0.5rem;
              `}
              {...{
                montant: evaluation,
                engine,
                situation,
                dottedName,
              }}
            ></PrimeWithLabel>
          </div>
        ) : (
          <PrimeStyle $inactive={true}>{computeStatusTitle(status)}</PrimeStyle>
        ))}
    </>
  )
}
