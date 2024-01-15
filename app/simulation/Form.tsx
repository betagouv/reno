'use client'

import Image from 'next/image'
import informationIcon from '@/public/information.svg'
import css from '@/components/css/convertToJs'
import Explications from '@/components/explications/Explications'
import InputSwitch, { getQuestionText } from '@/components/InputSwitch'
import { AnswerWrapper } from '@/components/InputUI'
import NextQuestions from '@/components/NextQuestions'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import questionType from '@/components/publicodes/questionType'
import {
  encodeSituation,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import { getRuleName } from '@/components/publicodes/utils'
import Result, { Results } from '@/components/Result'
import { Card, Section } from '@/components/UI'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from '@/node_modules/next/link'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import Publicodes from 'publicodes'
import FormButtons from './FormButtons'
import Share from './Share'
import Personas from './Personas'
import Suggestions from './Suggestions'
import simulationConfig from './simulationConfig.yaml'
import { QuestionHeader } from './QuestionHeader'
import { useMemo } from 'react'
import Notifications from '@/components/Notifications'

export default function Form({ searchParams, rules }) {
  const engine = useMemo(() => new Publicodes(rules), [rules])
  const answeredQuestions = [
    ...Object.keys(simulationConfig.situation || {}),
    ...getAnsweredQuestions(searchParams, rules),
  ]
  const started = answeredQuestions.length > 1 // because of simulation mode

  const situation = {
      ...(simulationConfig.situation || {}),
      ...getSituation(searchParams, rules),
    },
    validatedSituation = Object.fromEntries(
      Object.entries(situation).filter(([k, v]) =>
        answeredQuestions.includes(k),
      ),
    )
  console.log({ answeredQuestions, situation, started })
  const evaluation = engine.setSituation(validatedSituation).evaluate('aides'),
    value = formatValue(evaluation),
    nextQuestions = getNextQuestions(
      evaluation,
      answeredQuestions,
      simulationConfig,
      rules,
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
    'eval',
    engine.evaluate('MPR . non accompagnée'),
    engine.evaluate('gestes . montant'),
    engine.evaluate('revenu . classe'),
  )
  /*
  console.log(
    'currentQuestion',
    currentQuestion,
    currentValue,
    ruleQuestionType,
    nextQuestions,
  )
  */
  const ruleName = currentQuestion && getRuleName(currentQuestion)
  return (
    <div>
      <Section>
        {answeredQuestions.length > 0 && (
          <div
            style={css`
              text-align: right;
              float: right;
              margin-bottom: 0.6rem;
            `}
          >
            <Link href={'/'}>Recommencer</Link>
          </div>
        )}
        <Personas setSearchParams={setSearchParams} />
        {rule && (
          <Card $background={`#2a82dd1f`}>
            <div>
              {(!rule.type || !rule.type === 'question rhétorique') && (
                <QuestionHeader>
                  <h3>{getQuestionText(rule, currentQuestion, rules)}</h3>
                  {rule.descriptionHtml && (
                    <details>
                      <summary>
                        <Image
                          src={informationIcon}
                          width="25"
                          style={css`
                            vertical-align: bottom;
                          `}
                        />
                      </summary>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: rule.descriptionHtml,
                        }}
                      />
                    </details>
                  )}
                </QuestionHeader>
              )}
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

                <FormButtons
                  {...{
                    currentValue,
                    rules,
                    setSearchParams,
                    encodeSituation,
                    answeredQuestions,
                    currentQuestion,
                    situation,
                  }}
                />
              </AnswerWrapper>
            </div>
          </Card>
        )}
        <Notifications {...{ currentQuestion, engine }} />
        <NextQuestions {...{ nextQuestions, rules }} />
        <div
          style={css`
            margin-top: 1vh;
          `}
        >
          <h2>Votre Prime Rénov'</h2>
          <Results>
            <Result
              started={started}
              index={1}
              key={'acc'}
              {...{
                engine: engine.setSituation(situation),
                isFinal: !currentQuestion,
                rules,
                dottedName: 'MPR . accompagnée',
              }}
            />
            <span>OU</span>
            <Result
              started={started}
              index={2}
              key={'non acc'}
              {...{
                engine: engine.setSituation(situation),
                isFinal: !currentQuestion,
                dottedName: 'MPR . non accompagnée',
                hideNumeric: !currentQuestion?.startsWith('gestes . '),
                rules,
              }}
            />
          </Results>
        </div>
      </Section>
      <Explications {...{ engine, rules, situation }} />
      <Share searchParams={searchParams} />
    </div>
  )
}
