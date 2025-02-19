import { CTA, CTAWrapper, Section } from '@/components/UI'
import { push } from '@socialgouv/matomo-next'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

export default function Share() {
  const pathname = usePathname(),
    searchParams = useSearchParams()

  const [withAnswers, setWithAnswers] = useState(true)
  const [copied, setCopied] = useState(false)
  const searchParamsString = searchParams.toString()

  useEffect(() => {
    setCopied(false)
  }, [searchParams])

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
    <Section>
      <p>
        Pour ne pas perdre votre simulation en cours, sauvegardez-la en cliquant
        ici :
      </p>
      <form
        css={`
          text-align: center;
        `}
      >
        <CTAWrapper
          $justify="center"
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
              @media (max-width: 600px) {
                width: 100%;
              }
            `}
            $fontSize="normal"
            title="Cliquez pour partager le lien"
            onClick={() => {
              push(['trackEvent', 'Partage', 'Clic'])
              copyToClipboard()
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
          <div>
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
              Partager mes données de simulation
            </label>
          </div>
        )}
      </form>
    </Section>
  )
}
