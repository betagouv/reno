import { Card, LinkStyleButton } from '@/components/UI'
import { getRuleTitle } from '@/components/publicodes/utils'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from '@/node_modules/next/link'
import { push } from '@socialgouv/matomo-next'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import iconEclair from '@/public/eclair.svg'
import Image from 'next/image'
import AnswerItem from './AnswerItem'
import { getCommune } from '@/components/personas/enrichSituation'

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
  engine,
  situation,
  startsOpen = false,
  closedTitle,
}) {
  const [isOpen, setIsOpen] = useState(startsOpen)
  const [communes, setCommunes] = useState({})

  useEffect(() => {
    const fetchCommunes = async () => {
      const communesData = {}
      for (const answer of rawAnsweredQuestions) {
        if (['ménage . commune', 'logement . commune'].includes(answer)) {
          communesData[answer] = await getCommune(situation, answer)
        }
      }
      setCommunes(communesData)
    }
    fetchCommunes()
  }, [rawAnsweredQuestions, situation])
  const handleSummaryClick = () => {
    push(['trackEvent', 'Simulateur Principal', 'Clic', 'voir mes reponses'])
    setIsOpen((prevIsOpen) => !prevIsOpen) // Toggle the state using React
  }

  const preventSummaryClick = (event) => {
    event.preventDefault()
  }

  const answeredQuestions = rawAnsweredQuestions.filter(
    (el) => !['ménage . code région', 'ménage . code département'].includes(el),
  )

  const { pastCategories } = categoryData(
    nextQuestions,
    currentQuestion,
    answeredQuestions,
    rules,
  )

  const setSearchParams = useSetSearchParams()

  return (
    answeredQuestions.length !== 0 && (
      <Details $noMarker={answeredQuestions.length === 0} open={isOpen}>
        <summary onClick={preventSummaryClick}>
          <LinkStyleButton onClick={handleSummaryClick}>
            <Image src={iconEclair} alt="" />
            {isOpen
              ? closedTitle || 'Cacher mes réponses'
              : 'Modifier mes réponses'}
          </LinkStyleButton>
        </summary>
        {isOpen && (
          <Card
            css={`
              overflow: auto;
            `}
          >
            <div
              css={`
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 1rem;
              `}
            >
              <h3
                css={`
                  margin-bottom: 0;
                `}
              >
                Vos réponses
              </h3>
              <div
                css={`
                  cursor: pointer;
                  color: var(--color);
                  text-decoration: underline;
                  &:hover {
                    text-decoration: none;
                  }
                `}
                onClick={handleSummaryClick}
              >
                Fermer
              </div>
            </div>
            <p
              css={`
                color: var(--mutedColor);
              `}
            >
              Modifiez en cliquant sur la réponse, ou recommencez la simulation
              (lien en bas de page) :
            </p>
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
                <li key={category}>
                  <div
                    css={`
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                    `}
                  >
                    <span
                      css={`
                        color: var(--color);
                        font-weight: bold;
                      `}
                    >
                      {getRuleTitle(category, rules)}
                    </span>
                    <span
                      css={`
                        color: var(--color);
                      `}
                    >
                      Vos réponses
                    </span>
                  </div>
                  <ol
                    css={`
                      margin: 0.6rem 0;
                    `}
                  >
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
                        <AnswerItem
                          {...{
                            answer,
                            rules,
                            engine,
                            situation,
                            setSearchParams,
                            rawAnsweredQuestions,
                            communes,
                            setIsOpen,
                          }}
                        />
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ol>
            <Link
              href={'/simulation'}
              onClick={() =>
                push([
                  'trackEvent',
                  'Simulateur principal',
                  'Clic',
                  'recommencer',
                ])
              }
            >
              Recommencer la simulation
            </Link>
          </Card>
        )}
      </Details>
    )
  )
}

const Details = styled.details`
  h3 {
    margin-top: 0.6rem;
  }
  summary{
    cursor: default;
    display: flex;
    margin-top: 0.5rem;
    align-items: center;
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
