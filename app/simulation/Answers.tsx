import NextQuestions from '@/components/NextQuestions'
import { getRuleTitle } from '@/components/publicodes/utils'
import Link from '@/node_modules/next/link'
import styled from 'styled-components'

export const firstLevelCategory = (dottedName) => dottedName?.split(' . ')[0]

const categoryMap = (questions) =>
  Object.entries(
    questions.reduce((memo, next) => {
      const category = firstLevelCategory(next)
      return { ...memo, [category]: [...(memo[category] || []), next] }
    }, {}),
  )

const categoryData = (
  nextQuestions,
  currentQuestion,
  answeredQuestions,
  rules,
) => {
  const pastCategories = categoryMap(answeredQuestions),
    allCategories = categoryMap([...answeredQuestions, ...nextQuestions])

  const category = firstLevelCategory(currentQuestion)

  const categoryIndex = pastCategories.length + 1,
    categoryTitle = currentQuestion && rules[category]?.titre

  const isLastCategory = nextQuestions.every(
    (question) => firstLevelCategory(question) === category,
  )

  return {
    categoryTitle,
    categoryIndex,
    isLastCategory,
    allCategories,
  }
}

export default function Answers({
  answeredQuestions: rawAnsweredQuestions,
  nextQuestions,
  currentQuestion,
  rules,
  situation,
}) {
  console.log({ rawAnsweredQuestions })
  const answeredQuestions = rawAnsweredQuestions.filter(
    (el) => el !== 'simulation . mode',
  )

  const { categoryIndex, categoryTitle, isLastCategory, allCategories } =
    categoryData(nextQuestions, currentQuestion, answeredQuestions, rules)

  return (
    <Wrapper>
      <Details $noMarker={answeredQuestions.length === 0}>
        <summary>
          <div
            css={`
              display: flex;
              align-items: center;
              h2 {
                margin-left: 0.4rem !important;
              }
            `}
          >
            <small>
              {isLastCategory ? (
                'Dernière étape'
              ) : (
                <span>
                  Étape <Number>{categoryIndex}</Number> sur{' '}
                  {allCategories.length} :
                </span>
              )}
            </small>
            <h2>
              {currentQuestion ? <span>{categoryTitle}</span> : 'Terminé'}
            </h2>
          </div>

          <div
            css={`
              visibility: ${answeredQuestions.length > 0
                ? 'visible'
                : 'hidden'};
            `}
          >
            <Link href={'/simulation'}>Recommencer</Link>
          </div>
        </summary>
        <h3>Vos réponses</h3>
        {answeredQuestions.length > 0 ? (
          <AnswerList>
            {answeredQuestions.map((answer) => (
              <li key={answer}>
                {' '}
                <span>{getRuleTitle(answer, rules)}</span> -{' '}
                <span>{situation[answer]}</span>
              </li>
            ))}
          </AnswerList>
        ) : (
          <p>Vous n'avez pas encore validé de réponse.</p>
        )}
        <h3>Questions à venir</h3>
        <ol
          css={`
            list-style-type: circle;
            margin-bottom: 1rem;
          `}
        >
          {allCategories.slice(categoryIndex).map(([k, v]) => (
            <li key={k}>{getRuleTitle(k, rules)}</li>
          ))}
        </ol>
        {false && (
          <NextQuestions {...{ nextQuestions, rules, currentQuestion }} />
        )}
      </Details>
      <ProgressBar $ratio={(categoryIndex - 1) / allCategories.length} />
    </Wrapper>
  )
}

const AnswerList = styled.ol`
  margin: 0.6rem 0;
`

const Wrapper = styled.section`
  margin-bottom: 2vh;
`
const Details = styled.details`
  h3 {
    margin-top: 0.6rem;
  }
  summary{
            display: flex;
            justify-content: space-between;
            margin-bottom: 0vh;
            align-items: center;
            > small {
              color: #555;

            }
			h2 {

font-size: 100%;
margin: 0;
              color: #555;
			  font-weight: normal;

			}
  padding-bottom: 1vh;
  ${(p) =>
    p.$noMarker &&
    `
  summary::-webkit-details-marker {

  display: block

  } 
  summary{
            display: flex;
            justify-content: space-between;
            margin-bottom: 1.2vh;
            align-items: center;
            > small {
              color: #555;

            }
			h2 {

font-size: 110%

			}

}


  `}
`

const Number = styled.span`
  background: #000093;
  border-radius: 1.4rem;
  width: 1.6rem;
  height: 1.6rem;
  color: white;
  padding: 0;
  line-height: 1.4rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`

const ProgressBar = styled.div`
  height: 0.4rem;
  background: #000093;
  border-radius: 0.25rem;
  width: ${(p) => p.$ratio * 100}%;
`
