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
      {answeredQuestions.length > 0 && (
        <Header>
          {' '}
          <small>
            {isLastCategory ? (
              'Dernière étape'
            ) : (
              <span>
                Étape {categoryIndex} sur {allCategories.length}
              </span>
            )}
          </small>
          <Link href={'/simulation'}>Recommencer</Link>
        </Header>
      )}
      <Details $noMarker={answeredQuestions.length === 0}>
        <summary>
          {currentQuestion ? (
            <span>
              <Number>{categoryIndex}</Number> &nbsp;{categoryTitle}
            </span>
          ) : (
            'Terminé'
          )}
        </summary>
        <h2>Vos réponses</h2>
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
  h2 {
    margin-top: 0.6rem;
  }
  padding-bottom: 1.4vh;
  ${(p) =>
    p.$noMarker &&
    `
  summary::-webkit-details-marker {

  display: block

  } 
  summary{
display: block
}


  `}
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.2vh;
  align-items: center;
  > small {
    color: #555;
  }
`

const Number = styled.span`
  background: #000093;
  border-radius: 1rem;
  width: 1.4rem;
  display: inline-block;
  text-align: center;
  height: auto;
  color: white;
`

const ProgressBar = styled.div`
  height: 0.4rem;
  background: #000093;
  border-radius: 0.25rem;
  width: ${(p) => p.$ratio * 100}%;
`
