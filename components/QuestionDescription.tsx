import { useEffect, useState } from 'react'
import { push } from '@socialgouv/matomo-next'
import { useMediaQuery } from 'usehooks-ts'
import { Card, CTA } from './UI'
import { Details, preventSummaryClick } from '@/app/simulation/Answers'

export default function QuestionDescription({ currentQuestion, rule }) {
  const isMobile = useMediaQuery('(max-width: 800px)')

  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem('isOpen')
    return savedState !== null ? JSON.parse(savedState) : !isMobile
  })

  useEffect(() => {
    localStorage.setItem('isOpen', JSON.stringify(isOpen))
  }, [isOpen])

  const handleSummaryClick = (e) => {
    e.preventDefault()
    push(['trackEvent', 'Simulateur Principal', 'Clic', 'comment répondre'])
    setIsOpen((prevIsOpen) => !prevIsOpen)
  }
  return (
    currentQuestion &&
    rule.description && (
      <Details open={isOpen}>
        <summary onClick={preventSummaryClick}>
          <CTA
            $fontSize="normal"
            $importance="emptyBackground"
            title="Comment répondre"
            onClick={handleSummaryClick}
          >
            <span>
              <span aria-hidden="true">💡</span> Comment répondre&nbsp;?
            </span>
          </CTA>
        </summary>
        {isOpen && (
          <Card>
            <div
              dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }}
              css={`
                blockquote {
                  margin-top: 0.8rem;
                  border-left: 4px solid var(--lighterColor);
                  padding: 0 0.6rem;
                  color: #333;
                }
              `}
            />
          </Card>
        )}
      </Details>
    )
  )
}
