import { useEffect, useState } from 'react'
import { push } from '@socialgouv/matomo-next'
import iconReduire from '@/public/reduire.svg'
import Image from 'next/image'
import { useMediaQuery } from 'usehooks-ts'

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
    push(['trackEvent', 'Simulateur principal', 'Clic', 'comment répondre'])
    setIsOpen((prevIsOpen) => !prevIsOpen)
  }
  return (
    currentQuestion &&
    rule.description && (
      <details
        open={isOpen}
        css={`
          border-radius: 5px;
          background: #e8edff;
          padding: 0.5rem 1rem;
          margin-top: 1rem;
        `}
      >
        <summary
          css={`
            outline: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
            &::-webkit-details-marker {
              display: none;
            }
            &::marker {
              display: none;
            }
          `}
          onClick={handleSummaryClick}
        >
          <span>💡 Comment répondre ?</span>
          <span
            css={`
              border-radius: 50px;
              border: 1px solid #0974f6;
              color: #0974f6;
              padding: 0.5rem 0.8rem;
              display: flex;
              align-items: center;
            `}
          >
            {isOpen ? (
              <>
                Fermer{' '}
                <Image
                  src={iconReduire}
                  css={`
                    margin-left: 0.5rem;
                  `}
                />
              </>
            ) : (
              <>
                &nbsp;Ouvrir{' '}
                <Image
                  src={iconReduire}
                  css={`
                    margin-left: 0.5rem;
                    transform: rotate(180deg);
                  `}
                />
              </>
            )}
          </span>
        </summary>
        <div
          dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }}
          css={`
            margin-top: 1rem;
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
