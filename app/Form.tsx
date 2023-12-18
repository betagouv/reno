'use client'
import rules from './rules'

import css from '@/components/css/convertToJs'
import Explications from '@/components/explications/Explications'
import InputSwitch from '@/components/InputSwitch'
import {
  AnswerWrapper,
  FormButtonsWrapper,
  FormLinkButton,
} from '@/components/InputUI'
import NextQuestions from '@/components/NextQuestions'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import questionType from '@/components/publicodes/questionType'
import {
  encodeSituation,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import Result, { Results } from '@/components/Result'
import { Card } from '@/components/UI'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from '@/node_modules/next/link'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import Publicodes from 'publicodes'
import Personas from './Personas'
import Suggestions from './Suggestions'
import { getRuleName } from '@/components/publicodes/utils'

const engine = new Publicodes(rules)
const questionsConfig = { prioritaires: [], 'non prioritaires': [] }

export default function Form({ searchParams }) {
  const answeredQuestions = getAnsweredQuestions(searchParams, rules)

  const situation = getSituation(searchParams, rules),
    validatedSituation = Object.fromEntries(
      Object.entries(situation).filter(([k, v]) =>
        answeredQuestions.includes(k),
      ),
    )
  console.log({ answeredQuestions, situation })
  const evaluation = engine.setSituation(validatedSituation).evaluate('aides'),
    value = formatValue(evaluation),
    nextQuestions = getNextQuestions(
      evaluation,
      answeredQuestions,
      questionsConfig,
    )
  const currentQuestion = nextQuestions[0],
    rule = currentQuestion && rules[currentQuestion]

  const setSearchParams = useSetSearchParams()
  const ruleQuestionType =
    currentQuestion &&
    questionType(engine.setSituation(situation).evaluate(currentQuestion), rule)
  const rawValue = situation[currentQuestion]
  const currentValue =
    rawValue && (ruleQuestionType === 'text' ? rawValue.slice(1, -1) : rawValue)

  console.log(
    'currentQuestion',
    currentQuestion,
    currentValue,
    ruleQuestionType,
    nextQuestions,
  )
  const ruleName = currentQuestion && getRuleName(currentQuestion)
  return (
    <div>
      <Personas setSearchParams={setSearchParams} />
      {rule && (
        <Card>
          <label>
            <div>{rule.question || rule.titre || ruleName}</div>
            <AnswerWrapper>
              <Suggestions
                rule={rule}
                onClick={(value) =>
                  setSearchParams(
                    encodeSituation(
                      {
                        ...situation,
                        [currentQuestion]: value,
                      },
                      false,
                      answeredQuestions,
                    ),
                    true,
                    false,
                  )
                }
              />
              <InputSwitch
                {...{
                  rule,
                  rules,
                  currentValue,
                  currentQuestion,
                  situation,
                  answeredQuestions,
                  setSearchParams,
                  engine,
                }}
              />

              <FormButtonsWrapper>
                {currentValue != null && (
                  <FormLinkButton
                    href={setSearchParams(
                      encodeSituation(
                        {
                          ...situation,
                          [currentQuestion]: situation[currentQuestion],
                        },
                        false,
                        [...answeredQuestions, currentQuestion],
                      ),
                      true,
                      false,
                    )}
                  >
                    Suivant
                  </FormLinkButton>
                )}
              </FormButtonsWrapper>
            </AnswerWrapper>
          </label>
        </Card>
      )}
      <NextQuestions {...{ nextQuestions, rules }} />
      {answeredQuestions.length > 0 && (
        <div
          style={css`
            margin-top: 1rem;
          `}
        >
          <Link href={'/'}>Recommencer</Link>
        </div>
      )}
      <div
        style={css`
          margin-top: 1vh;
        `}
      >
        <h2>Votre Prime Rénov'</h2>
        <Results>
          <Result
            key={'acc'}
            {...{
              engine: engine.setSituation(situation),
              isFinal: !currentQuestion,
              rules,
              dottedName: 'MPR . accompagnée',
            }}
          />
          <Result
            key={'non acc'}
            {...{
              engine: engine.setSituation(situation),
              isFinal: !currentQuestion,
              dottedName: 'MPR . non accompagnée',
              rules,
            }}
          />
        </Results>
      </div>
      <Explications {...{ engine, rules, situation }} />
    </div>
  )
}
