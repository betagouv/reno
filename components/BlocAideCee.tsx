import React from 'react'
import Image from 'next/image'
import GesteQuestion from './GesteQuestion'
import ceeImage from '@/public/cee.svg'
import informationIcon from '@/public/information.svg'
import { BlocAide, InlineLink, PrimeStyle } from './UI'

export const BlocAideCEE = ({ infoCEE, rules, engine, situation, answeredQuestions, setSearchParams }) => {
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
                title={`formulaire ${infoCEE.code}`}
                href={infoCEE.lien}
                target="_blank"
              >
                {infoCEE.code}
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