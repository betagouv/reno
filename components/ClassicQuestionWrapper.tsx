import FormButtons from '@/app/simulation/FormButtons'
import { QuestionHeader } from '@/app/simulation/QuestionHeader'
import Suggestions from '@/app/simulation/Suggestions'
import { AnswerWrapper, QuestionCard, Subtitle } from './InputUI'
import Notifications from './Notifications'
import { encodeSituation } from './publicodes/situationUtils'

import Answers, { categoryData } from '@/app/simulation/Answers'
import ProgressBar from '@/app/simulation/ProgressBar'
import { useRouter, useSearchParams } from 'next/navigation'
import CopyButton from './CopyButton'
import QuestionDescription from './QuestionDescription'
import UserProblemBanner from './UserProblemBanner'
import AmpleurModuleBanner from './ampleur/AmpleurModuleBanner'
import { getRuleName } from './publicodes/utils'
import { push } from '@socialgouv/matomo-next'
import Link from 'next/link'
import { CTAWrapper, CTA } from './UI'

export const QuestionText = ({
  rule,
  question: dottedName,
  situation,
  engine,
}) => {
  const ruleName = getRuleName(dottedName)

  const text = rule.question.texte
    ? engine.setSituation(situation).evaluate(rule.question).nodeValue
    : rule.question || rule.titre || ruleName
  return <h1>{text.replace(/\s\?/, '')}&nbsp;?</h1>
}

export default function ClassicQuestionWrapper({
  children,
  rule,
  currentQuestion,
  rules,
  answeredQuestions,
  situation,
  setSearchParams,
  questionsToSubmit = [currentQuestion],
  currentValue,
  engine,
  noSuggestions,
  nextQuestions,
  noButtons = false,
}) {
  const router = useRouter()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const { depuisModule } = searchParams
  const { categoryTitle } = categoryData(
    nextQuestions,
    currentQuestion,
    answeredQuestions,
    rules,
  )
  const remaining =
    nextQuestions.indexOf("parcours d'aide") !== -1
      ? nextQuestions.indexOf("parcours d'aide")
      : nextQuestions.length

  return (
    <>
      <ProgressBar
        {...{
          answeredQuestions,
          nextQuestions,
          currentQuestion,
          rules,
          situation,
          searchParams,
        }}
      />
      <AmpleurModuleBanner
        {...{
          depuisModule,
          setSearchParams,
          situation,
          remaining,
        }}
      />
      <QuestionCard>
        {noButtons && (
          <CTAWrapper
            $justify="start"
            css={`
              margin-top: 0;
            `}
          >
            <CTA
              $fontSize="normal"
              $importance="emptyBackground"
              css={`
                a {
                  padding: 0.5rem 0.8rem;
                }
              `}
            >
              <Link
                href="#"
                onClick={() => {
                  push(['trackEvent', 'Simulateur Principal', 'Clic', 'retour'])
                  router.back()
                }}
              >
                ⬅ Retour
              </Link>
            </CTA>
          </CTAWrapper>
        )}
        {!rule.type && (
          <QuestionHeader>
            <div>
              <small>{categoryTitle}</small>
              <QuestionText
                {...{
                  rule,
                  question: currentQuestion,
                  rules,
                  situation,
                  engine,
                }}
              />
              {rule['sous-titre'] && (
                <Subtitle
                  dangerouslySetInnerHTML={{ __html: rule.sousTitreHtml }}
                ></Subtitle>
              )}
            </div>
            <div>
              <CopyButton searchParams={searchParams} />
            </div>
          </QuestionHeader>
        )}
        <AnswerWrapper>
          {!noSuggestions && (
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
                  'url',
                  false,
                )
              }
            />
          )}
          {children}
        </AnswerWrapper>
        {!noButtons && (
          <FormButtons
            {...{
              currentValue,
              rules,
              setSearchParams,
              encodeSituation,
              answeredQuestions,
              questionsToSubmit,
              currentQuestion,
              situation,
              depuisModule,
            }}
          />
        )}
        <Notifications {...{ currentQuestion, engine }} />
        <QuestionDescription {...{ currentQuestion, rule }} />
        <Answers
          {...{
            answeredQuestions,
            nextQuestions,
            currentQuestion,
            rules,
            engine,
            situation,
          }}
        />
        <UserProblemBanner />
      </QuestionCard>
    </>
  )
}
