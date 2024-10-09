import { Card, CTA, LinkStyleButton } from '@/components/UI'
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
  const [isOpen, setIsOpen] = useState(false);

  const handleSummaryClick = () => {
    push(["trackEvent", "Simulateur principal", "Clic", "voir mes reponses"]);
    setIsOpen((prevIsOpen) => !prevIsOpen); // Toggle the state using React
  };

  const preventSummaryClick = (event) => {
    event.preventDefault();
  };

  const answeredQuestions = rawAnsweredQuestions.filter(
    (el) => !['simulation . mode', 'ménage . code région', 'ménage . code département'].includes(el)
  );

  const { pastCategories } = categoryData(
    nextQuestions,
    currentQuestion,
    answeredQuestions,
    rules
  );

  const setSearchParams = useSetSearchParams();

  return answeredQuestions.length !== 0 && (
    <Details $noMarker={answeredQuestions.length === 0} open={isOpen}>
      <summary css={`justify-content: flex-end;`} onClick={preventSummaryClick}>
          <div
            css={`
              display: flex;
              visibility: ${answeredQuestions.length > 0
                ? 'visible'
                : 'hidden'};
            `}
          >
            <LinkStyleButton
              onClick={handleSummaryClick}
              css={`
                cursor: pointer;
                width: max-content;
                font-weight: 500;
                display:block;
              `}
            >
              {isOpen ? 'Cacher' : 'Modifier'} mes réponses
            </LinkStyleButton>
          </div>
      </summary>
      {isOpen && (
        <Card css={`overflow: auto;`}>
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
                visibility: ${answeredQuestions.length > 0 ? 'visible' : 'hidden'};
              `}
            >
              <Link
                href={'/simulation'}
                onClick={() =>
                  push(['trackEvent', 'Simulateur principal', 'Clic', 'voir mes reponses'])
                }
              >
                Recommencer
              </Link>
            </div>
          </div>
          <p css={`color: var(--mutedColor)`}>Voici un aperçu de vos réponses au formulaire. Vous pouvez les modifier en cliquant sur la réponse, 
              ou recommencer totalement le formulaire via le lien ci-dessus.</p>
            
          {pastCategories.length > 0 ? (
            <ol
              css={`
                list-style-type: none;
                padding-left: 0;
                ol {
                  list-style-type: none;
                }
              `}
            >
              {pastCategories.map(([category, questions]) => (
                <li 
                  key={category}
                  >
                  <div css={`
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  `}>
                    <span css={`color: var(--color); font-weight: bold;`}>{getRuleTitle(category, rules)}</span>
                    <span  css={`color: var(--color);`}>Vos réponses</span>
                  </div>
                  <AnswerList>
                    {questions.map((answer) => (
                      <li
                        key={answer}
                        css={`
                          display: flex;
                          align-items: center;
                          justify-content: space-between;
                          flex-wrap: nowrap;
                          margin-bottom: 0.5rem;
                        `}
                      >
                        <span>{getRuleTitle(answer, rules)}</span>{' '}
                        <span>
                          <CTA
                            $fontSize="normal"
                            $importance="emptyBackground"
                            css={`:hover {
                                background: var(--color);
                                color: white;    
                              }
                            `}
                          >
                            <Link
                              css={`padding: 0.3rem !important;`}
                              href={setSearchParams(
                                {
                                  question: encodeDottedName(answer),
                                  ...encodeSituation(
                                    situation,
                                    false,
                                    rawAnsweredQuestions.filter((q) => q !== answer),
                                  ),
                                },
                                'url',
                              )}
                            >
                              {situation[answer]}
                            </Link>
                          </CTA>
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
        </Card>
      )}
    </Details>
  );
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
