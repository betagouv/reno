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
    push(['trackEvent', 'Simulateur Principal', 'Clic', 'comment répondre'])
    setIsOpen((prevIsOpen) => !prevIsOpen)
  }
  return (
    currentQuestion &&
    rule.description && (
      <details
        open={isOpen}
        css={`
          margin-top: 1rem;
        `}
      >
        <summary
          css={`
            outline: none;
            display: flex;
            align-items: center;
            justify-content: center;
            &::-webkit-details-marker {
              display: none;
            }
            &::marker {
              display: none;
            }
            padding: 0.5rem 1rem;
            border: 1px solid #dddddd;
            color: var(--color);
            position: relative;
          `}
          onClick={handleSummaryClick}
        >
          <h2
            css={`margin: 0;
                  font-size: 100%;
                  font-weight: normal;
            }`}
          >
            <span aria-hidden="true">💡</span> Comment répondre&nbsp;?
          </h2>
          <span
            css={`
              border-radius: 50px;
              color: var(--color);
              padding: 0.6rem 0.6rem;
              display: flex;
              align-items: center;
              position: absolute;
              right: 0;
              top: 0.15rem;
            `}
          >
            {isOpen ? (
              <small>
                Fermer{' '}
                <Image
                  src={iconReduire}
                  css={`
                    margin-left: 0.2rem;
                  `}
                  alt="icone réduire"
                />
              </small>
            ) : (
              <small>
                &nbsp;Ouvrir{' '}
                <Image
                  src={iconReduire}
                  css={`
                    margin-left: 0.2rem;
                    transform: rotate(180deg);
                  `}
                  alt="icone réduire"
                />
              </small>
            )}
          </span>
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
