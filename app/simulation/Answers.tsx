import NextQuestions from '@/components/NextQuestions'
import { Card, LinkStyleButton } from '@/components/UI'
import {
  encodeDottedName,
  encodeSituation,
} from '@/components/publicodes/situationUtils'
import { getRuleTitle } from '@/components/publicodes/utils'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from '@/node_modules/next/link'
import { push } from '@socialgouv/matomo-next'
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
  const aideLocale = rules[currentQuestion.split(' . ').slice(0, 2).join(' . ').trim()]
  const isLastCategory = currentQuestion == nextQuestions.slice(-1)
  return {
    categoryTitle,
    aideLocale,
    isLastCategory,
    allCategories,
    pastCategories,
  }
}

export default function Answers({
  answeredQuestions: rawAnsweredQuestions,
  nextQuestions,
  currentQuestion,
  rules,
  situation,
}) {
  const isMobile = useMediaQuery('(max-width: 800px)')
  const handleSummaryClick = (event) => {
    push(["trackEvent", "Simulateur principal", "Clic", "voir mes reponses"])
    const detailsElement = event.target.closest('details');
    if (detailsElement) {
      detailsElement.open = !detailsElement.open;
    }
  }
  const preventSummaryClick = (event) => {
    event.preventDefault();
  };

  const answeredQuestions = rawAnsweredQuestions.filter(
    (el) => !['simulation . mode', "ménage . code région", "ménage . code département"].includes(el)
  )

  const {
    isLastCategory,
    allCategories,
    pastCategories,
  } = categoryData(nextQuestions, currentQuestion, answeredQuestions, rules)
  
  // Dans le cas du simulateur principale, on considère que le questionnaire s'arrête au moment du choix du parcours d'aide
  const nbQuestionTotal = answeredQuestions.indexOf('parcours d\'aide') !== -1 ?
                            answeredQuestions.indexOf('parcours d\'aide') :
                            (answeredQuestions.length + 
                              (nextQuestions.indexOf('parcours d\'aide') !== -1 ?
                                nextQuestions.indexOf('parcours d\'aide') :
                                nextQuestions.length
                              )
                            )
                            
  const indexQuestionActuel = answeredQuestions.length + 1
  const setSearchParams = useSetSearchParams()
  return (
    <Wrapper>
      <Details $noMarker={answeredQuestions.length === 0}>
        <summary onClick={preventSummaryClick}>
          <div
            css={`
              display: flex;
              align-items: center;
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
                    title={`Étape ${indexQuestionActuel} sur un total de ${nbQuestionTotal} étapes. Cliquez pour obtenir le détail.`}
                  >
                    {!isMobile && 'Étape '}
                    <Number>{indexQuestionActuel}</Number> sur {nbQuestionTotal}
                  </span>
                )}
              </small>
            }
          </div>

          <div
            css={`
              visibility: ${answeredQuestions.length > 0
                ? 'visible'
                : 'hidden'};
            `}
          >
            <LinkStyleButton onClick={handleSummaryClick} css={`cursor: pointer;`}>Voir mes réponses</LinkStyleButton>
          </div>
        </summary>
        <Card>
          <div
            css={`
              display: flex;
              align-items: center;
              justify-content: space-between;
            `}
          >
            <h3>Vos réponses</h3>
            <div
              css={`
                visibility: ${answeredQuestions.length > 0
                  ? 'visible'
                  : 'hidden'};
              `}
            >
              <Link 
                href={'/simulation'}
                onClick={() => push(["trackEvent", "Simulateur principal", "Clic", "voir mes reponses"]) }
              >Recommencer</Link>
            </div>
          </div>
          {pastCategories.length > 0 ? (
            <ol
              css={`
                list-style-type: circle;
                ol {
                  list-style-type: disc;
                }
              `}
            >
              {pastCategories.map(([category, questions]) => (
                <li key={category}>
                  {getRuleTitle(category, rules)}
                  <AnswerList>
                    {questions.map((answer) => (
                      <li
                        key={answer}
                        css={`
                          display: flex;
                          align-items: center;
                          justify-content: space-between;
                          flex-wrap: wrap;
                        `}
                      >
                        <span>{getRuleTitle(answer, rules)}</span>{' '}
                        <span
                          css={`
                            border-bottom: 1px dashed #aaa;
                            flex-grow: 1;
                            margin: 0 1rem;
                            @media (max-width: 800px) {
                              display: none;
                            }
                          `}
                        ></span>
                        <span
                          css={`
                            @media (max-width: 800px) {
                              flex-grow: 1;
                              text-align: right;
                            }
                          `}
                        >
                          <Link
                            href={setSearchParams(
                              {
                                question: encodeDottedName(answer),
                                ...encodeSituation(
                                  situation,
                                  false,
                                  answeredQuestions.filter((q) => q !== answer),
                                ),
                              },
                              'url',
                            )}
                          >
                            {situation[answer]}
                          </Link>
                        </span>
                      </li>
                    ))}
                  </AnswerList>
                </li>
              ))}
            </ol>
          ) : (
            <p>Vous n'avez pas encore validé de réponse.</p>
          )}
          <h3>Prochaines étapes</h3>
          <ol
            css={`
              list-style-type: circle;
              margin-bottom: 1rem;
            `}
          >
            {allCategories.slice(indexQuestionActuel).map(([k, v]) => (
              <li key={k}>{getRuleTitle(k, rules)}</li>
            ))}
          </ol>
          {false && (
            <NextQuestions {...{ nextQuestions, rules, currentQuestion }} />
          )}
        </Card>
      </Details>
      <ProgressBar $ratio={(indexQuestionActuel - 1) / nbQuestionTotal} />
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
            cursor: default;
            display: flex;
            justify-content: space-between;
            margin-bottom: 0vh;
            align-items: center;
        color: #555;
		> span {color:inherit}

       
			h2 {

font-size: 100%;
margin: 0;
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
			display: block
			h2 {

font-size: 110%

			}

}


  `}
`

export const Number = styled.span`
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
