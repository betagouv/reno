import { useState, useEffect } from 'react'
import { push } from '@socialgouv/matomo-next'
import { formatNumberWithSpaces } from '../utils'
import DPEQuickSwitch from '../dpe/DPEQuickSwitch'
import TargetDPETabs from '../mpra/TargetDPETabs'
import rules from '@/app/règles/rules'
import DPELabel, { conversionLettreIndex } from '../dpe/DPELabel'
import AddressSearch from '../AddressSearch'
import Select from '../Select'
import Image from 'next/image'
import editIcon from '@/public/crayon.svg'
import CalculatorWidget from '../CalculatorWidget'
import { encodeDottedName, encodeSituation } from '../publicodes/situationUtils'
import { DPEAppreciationInfo, hasResult } from '../module/ValeurVerte'
import { usageLogement, usageLogementValues } from '@/app/module/AmpleurInputs'
import {
  IdFQuestion,
  PersonnesQuestion,
  RevenuQuestion,
  TypeResidence,
} from '@/app/module/AmpleurQuestions'
import {
  EvaluationValue,
  EvaluationValueWrapper,
} from '@/app/module/AmpleurEvaluation'
import { useAides } from './useAides'
import { filterAidesToDisplay } from './AmpleurSummary'
import { AmpleurAideSummary } from '@/app/module/AmpleurAideSummary'

const AmpleurWidget = ({
  onChange,
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  isMobile,
  shouldDisplay,
}) => {
  return (
    <CalculatorWidget>
      <div
        css={`
          display: flex;
        `}
      >
        <div
          css={`
            > section,
            > div {
              margin-bottom: 1rem;
            }
            label select {
              margin-top: 0.5rem;
            }
            span {
              display: inline-block;
              margin-bottom: 0.5rem;
            }
          `}
        >
          <TypeResidence
            {...{ setSearchParams, situation, answeredQuestions, dot: false }}
          />
          <IdFQuestion
            {...{
              setSearchParams,
              isMobile,
              situation,
              answeredQuestions,
              dot: false,
            }}
          />
          <PersonnesQuestion
            {...{
              situation,
              onChange,
              answeredQuestions,
              dot: false,
            }}
          />
          <RevenuQuestion
            {...{
              answeredQuestions,
              situation,
              engine,
              setSearchParams,
              dot: false,
            }}
          />
        </div>
        <div
          css={`
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            ${isMobile && 'flex-direction: column;'}
            > div {
              display: flex;
              flex-direction: column;
              width: 100%;
            }
          `}
        >
          <div
            css={`
              > section {
                margin: 0;
                padding: 0 1rem;
              }
            `}
          >
            {shouldDisplay > 0 ? (
              <EvaluationValue
                {...{
                  engine,
                  situation,
                  shouldDisplay,
                  noDefaultSituation: situation,
                  currentDPE: situation['DPE . actuel'],
                  targetDPE: situation['projet . DPE visé'],
                  disclaimer: false,
                }}
              />
            ) : (
              <small>
                Veuillez renseigner les valeurs de la calculatrice pour
                connaître le montant
              </small>
            )}
          </div>
        </div>
      </div>
    </CalculatorWidget>
  )
}

export default AmpleurWidget
