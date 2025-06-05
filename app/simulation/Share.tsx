import { CTA, CTAWrapper } from '@/components/UI'
import { push } from '@socialgouv/matomo-next'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Share({
  text = 'Partagez la simulation en cliquant ici :',
  align = 'center',
}) {
  const isMobile = window !== undefined ? window.innerWidth <= 600 : false
  const pathname = usePathname(),
    searchParams = useSearchParams()

  const [withAnswers, setWithAnswers] = useState(true)
  const [copied, setCopied] = useState(false)
  const searchParamsString = searchParams.toString()

  useEffect(() => {
    setCopied(false)
  }, [searchParams])

  const share = async () => {
    try {
      await navigator.share({
        title: 'Simulation MesAidesRéno',
        text: "Simulation d'aide à la rénovation énergétique",
        url:
          'https://mesaidesreno.beta.gouv.fr' +
          pathname +
          '?' +
          searchParamsString,
      })
      setCopied(true)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        'https://mesaidesreno.beta.gouv.fr' +
          (withAnswers ? pathname : '') +
          (searchParamsString && withAnswers ? '?' + searchParamsString : ''),
      )
      setCopied(true)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <>
      <p>{text}</p>
      <form
        css={`
          text-align: ${align};
        `}
      >
        <CTAWrapper
          $justify={align}
          css={`
            margin: 2vh 0;
          `}
        >
          <CTA
            $importance="emptyBackground"
            css={`
              ${copied &&
              `
                background: rgba(190, 242, 197, 0.2);
                border: 1px dashed var(--validColor);
              `}
            `}
            $fontSize="normal"
            title="Cliquez pour partager le lien"
            onClick={() => {
              push(['trackEvent', 'Partage', 'Clic'])
              isMobile && navigator.share ? share() : copyToClipboard()
            }}
          >
            <span
              css={`
                ${copied && 'color: var(--validColor) !important;'}
              `}
            >
              {!copied ? (
                <>
                  <span aria-hidden="true">🔗</span> Copier le lien
                </>
              ) : (
                <>
                  <span aria-hidden="true">✔</span> Lien copié
                </>
              )}
            </span>
          </CTA>
        </CTAWrapper>
        {searchParamsString && (
          <div
            css={`
              display: flex;
              align-items: center;
              justify-content: ${align == 'center' ? 'space-between' : 'left'};
            `}
          >
            <input
              type="checkbox"
              id="withAnswers"
              name="withAnswers"
              checked={withAnswers}
              onChange={() => {
                setCopied(false)
                setWithAnswers(!withAnswers)
              }}
            />{' '}
            <label htmlFor="withAnswers">
              Intégrer mes données de simulation
            </label>
          </div>
        )}
      </form>
    </>
  )
}
