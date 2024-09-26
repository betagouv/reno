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
import { useState } from 'react'
import styled from 'styled-components'

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

export default function Answers({
  answeredQuestions: rawAnsweredQuestions,
  nextQuestions,
  currentQuestion,
  rules,
  situation,
}) {
  
  const [isOpen, setIsOpen] = useState(false)
  const handleSummaryClick = (event) => {
    push(["trackEvent", "Simulateur principal", "Clic", "voir mes reponses"])
    const detailsElement = event.target.closest('details');
    if (detailsElement) {
      setIsOpen(!detailsElement.open);
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
    allCategories,
    pastCategories,
  } = categoryData(nextQuestions, currentQuestion, answeredQuestions, rules)
  
  const indexQuestionActuel = answeredQuestions.length + 1
  const setSearchParams = useSetSearchParams()
  return answeredQuestions.length !== 0 && (
    <Details $noMarker={answeredQuestions.length === 0}>
      <summary 
        css={`justify-content: flex-end;`} 
        onClick={preventSummaryClick}
      >
        <div css={`display: flex;`}>
          <div
            css={`
              visibility: ${answeredQuestions.length > 0
                ? 'visible'
                : 'hidden'};
            `}
          >
            <LinkStyleButton 
              onClick={handleSummaryClick} 
              css={`cursor: pointer;`}>
                {isOpen ? "Cacher": "Voir"} mes réponses
            </LinkStyleButton>
          </div>
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
                padding-left: 0;
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
  )
}

const AnswerList = styled.ol`
  margin: 0.6rem 0;
`

const Details = styled.details`
  h3 {
    margin-top: 0.6rem;
  }
  summary{
    cursor: default;
    display: flex;
    justify-content: flex-end;
    margin-top: 1vh;
    align-items: center;
    color: #555;
    > span {color:inherit}       
    h2 {
      font-size: 100%;
      margin: 0;
      font-weight: normal;
    }
    ${(p) =>
      p.$noMarker &&
      `
      summary::-webkit-details-marker {
        display: block;
      } 
      summary{
			  display: block;
			  h2 {
          font-size: 110%;
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
