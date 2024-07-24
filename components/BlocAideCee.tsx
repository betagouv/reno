import React from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import GesteQuestion from './GesteQuestion'
import ceeImage from '@/public/cee.svg'
import informationIcon from '@/public/information.svg'

const BlocAideCEE = ({ infoCEE, rules, engine, situation, answeredQuestions, setSearchParams }) => {
  return (
    <BlocAide>
      <div className="aide-header">
        <Image src={ceeImage} alt="logo Cee" width="60" />
        <div>
          {infoCEE.montant === 'Non applicable' ? (
            <>
              <PrimeStyle $inactive={true}>
                <strong>Non applicable</strong>
              </PrimeStyle>
              <span className="aide-details">
                {' '}
                (non cumulable avec la Prime Coup de pouce)
              </span>
            </>
          ) : (
            <PrimeStyle>
              {'Prime minimum de '}
              <strong>{infoCEE.montant}</strong>
            </PrimeStyle>
          )}
          <h3>
            Prime CEE (Certificats d'Économie d'Énergie)
            <br />
            <small
              css={`
                color: #666;
                font-size: 0.6em;
                font-weight: 500;
              `}
            >
              Plus d'infos:{' '}
              <InlineLink
                title={`formulaire ${infoCEE.titre}`}
                href={infoCEE.lien}
                target="_blank"
              >
                {infoCEE.titre}
              </InlineLink>
            </small>
          </h3>
        </div>
      </div>
      <div className="aide-details">
        <div
          css={`
            background-image: linear-gradient(0deg, #2a82dd, #2a82dd);
            background-position: 0 0;
            background-repeat: no-repeat;
            background-size: 0.25rem 100%;
            font-size: 1rem;
            line-height: 1.5rem;
            padding-left: 1.25rem;
            margin-bottom: 0.8rem;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
              margin-bottom: 0.4rem;
              color: #2a82dd;
              font-weight: 500;
              img {
                margin-right: 0.4rem;
              }
            `}
          >
            <Image src={informationIcon} alt="infobulle" width="25" />
            <span>Informations</span>
          </div>
          <p>
            Ce montant est le minimum imposé par l'État, les fournisseurs
            d'énergies sont libres d'appliquer leur propre formule tant
            qu'elle reste plus avantageuse.
          </p>
        </div>
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
  )
}

export default BlocAideCEE

const BlocAide = styled.div`
  text-align: left;
  padding: 1.5rem 1.5rem 1.75rem;
  border: 1px solid #ddd;
  border-bottom: 3px solid #000091;
  margin-bottom: 1rem;
  .aide-header {
    display: flex;
    align-items: center;
    color: #2a82dd;
    font-weight: 500;

    > img {
      margin-right: 1.4rem;
      width: 3.5rem;
      height: auto;
    }
  }
  h3 {
    color: #000091;
    margin: 1rem 0rem;
  }
  .aide-details {
    font-size: 0.9rem;
    line-height: 1.25rem;
    color: #3a3a3a;
  }
`

const PrimeStyle = styled.span`
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

const InlineLink = styled.a`
  color: #666;
  text-decoration: none;
  background-image: linear-gradient(0deg, currentColor, currentColor),
    linear-gradient(0deg, currentColor, currentColor);
  background-position:
    0 100%,
    0 calc(100% - 0.0625em);
  background-repeat: no-repeat, no-repeat;
  background-size:
    0 0.125em,
    100% 0.0625em;
  &:after {
    content: '';
    display: inline-block;
    flex: 0 0 auto;
    height: 1rem;
    margin-left: 0.25rem;
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTEwIDZ2Mkg1djExaDExdi01aDJ2NmExIDEgMCAwIDEtMSAxSDRhMSAxIDAgMCAxLTEtMVY3YTEgMSAwIDAgMSAxLTFoNlptMTEtM3Y4aC0yVjYuNDEzbC03Ljc5MyA3Ljc5NC0xLjQxNC0xLjQxNEwxNy41ODUgNUgxM1YzaDhaIi8+PC9zdmc+);
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTEwIDZ2Mkg1djExaDExdi01aDJ2NmExIDEgMCAwIDEtMSAxSDRhMSAxIDAgMCAxLTEtMVY3YTEgMSAwIDAgMSAxLTFoNlptMTEtM3Y4aC0yVjYuNDEzbC03Ljc5MyA3Ljc5NC0xLjQxNC0xLjQxNEwxNy41ODUgNUgxM1YzaDhaIi8+PC9zdmc+);
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    vertical-align: calc(0.375em - 0.5rem);
    width: 1rem;
    background: #666;
  }
  &:hover {
    text-decoration: underline;
  }
`
