'use client'
import { useEffect, useState } from 'react'
import { push } from '@socialgouv/matomo-next'
import { useMediaQuery } from 'usehooks-ts'
import Button from '@codegouvfr/react-dsfr/Button'

export default function QuestionDescription({ currentQuestion, rule }) {
  const isMobile = useMediaQuery('(max-width: 800px)')

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const savedState = localStorage.getItem('isOpen')
    const result = savedState !== null ? JSON.parse(savedState) : !isMobile
    setIsOpen(result)
  }, [setIsOpen, isMobile])

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
      <details
        open={isOpen}
        css={`
          margin: 2vh 0;
        `}
      >
        <summary
          css={`
            outline: none;
            display: block;
            &::-webkit-details-marker {
              display: none;
            }
            &::marker {
              display: none;
            }
            button {
              width: 100%;
              justify-content: center;
              padding: 0;
            }
          `}
          onClick={handleSummaryClick}
        >
          <Button priority="tertiary">
            <span aria-hidden="true">💡</span>{' '}
            {isOpen ? "Cacher l'aide" : 'Comment répondre ?'}
          </Button>
        </summary>
        <div
          dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }}
          css={`
            border-radius: 5px;
            background: #e8edff;
            padding: 0.5rem 1rem;
            blockquote {
              margin-top: 0.8rem;
              border-left: 4px solid var(--lighterColor);
              padding: 0 0.6rem;
              color: #333;
            }
          `}
        ></div>
      </details>
    )
  )
}
