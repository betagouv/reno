import styled from 'styled-components'
import { useMediaQuery } from 'usehooks-ts'

export const firstLevelCategory = (dottedName) => dottedName?.split(' . ')[0]

const categoryMap = (questions) =>
  Object.entries(
    questions.reduce((memo, next) => {
      const category = firstLevelCategory(next)
      return { ...memo, [category]: [...(memo[category] || []), next] }
    }, {}),
  )

export const categoryData = (
  nextQuestions,
  currentQuestion,
  answeredQuestions,
  rules,
) => {
  const pastCategories = categoryMap(answeredQuestions),
    allCategories = categoryMap([...answeredQuestions, ...nextQuestions])

  const category = firstLevelCategory(currentQuestion)
  const categoryTitle = currentQuestion && rules[category]?.titre
  const isLastCategory = currentQuestion == nextQuestions.slice(-1)
  return {
    categoryTitle,
    isLastCategory,
    allCategories,
    pastCategories,
  }
}

export default function Stepper({
  answeredQuestions: rawAnsweredQuestions,
  nextQuestions,
  currentQuestion,
  rules,
}) {
  const isMobile = useMediaQuery('(max-width: 800px)')
  const answeredQuestions = rawAnsweredQuestions.filter(
    (el) =>
      ![
        'simulation . mode',
        'ménage . code région',
        'ménage . code département',
      ].includes(el),
  )

  const { isLastCategory } = categoryData(
    nextQuestions,
    currentQuestion,
    answeredQuestions,
    rules,
  )

  // Dans le cas du simulateur principale, on considère que le questionnaire s'arrête au moment du choix du parcours d'aide
  const nbQuestionTotal =
    answeredQuestions.indexOf("parcours d'aide") !== -1
      ? answeredQuestions.indexOf("parcours d'aide")
      : answeredQuestions.length +
        (nextQuestions.indexOf("parcours d'aide") !== -1
          ? nextQuestions.indexOf("parcours d'aide")
          : nextQuestions.length)

  const indexQuestionActuel = answeredQuestions.length + 1
  return (
    <Wrapper
      css={`
        float: left;
        width: 100%;
        height: 55px;
        min-height: 55px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        margin: 0 0 1.5rem 0;
      `}
    >
      {/* <div
        css={`
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          h2 {
            margin-left: 0.4rem !important;
          }
        `}
      >
        {indexQuestionActuel <= nbQuestionTotal &&
          <small>
            {isLastCategory ? (
              'Dernière étape'
            ) : (
              <span
                title={`Étape ${indexQuestionActuel} sur un total de ${nbQuestionTotal} étapes.`}
              >
                {!isMobile && 'Étape '}
                <Number>{indexQuestionActuel}</Number> sur {nbQuestionTotal}
              </span>
            )}
          </small>
        }
      </div> */}
      <ProgressBar
        $ratio={Math.min(indexQuestionActuel / nbQuestionTotal, 1)}
      />
    </Wrapper>
  )
}

const Wrapper = styled.section`
  margin: 0;
`

export const Number = styled.span`
  background: var(--color);
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
  background: var(--color);
  border-radius: 0.25rem;
  width: ${(p) => p.$ratio * 100}%;
`
