import CalculatorWidget from '../CalculatorWidget'
import {
  IdFQuestion,
  PersonnesQuestion,
  RevenuQuestion,
  TypeResidence,
} from '@/app/module/AmpleurQuestions'
import { EvaluationValue } from '@/app/module/AmpleurEvaluation'

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
          > div {
            flex: 1;
          }
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
