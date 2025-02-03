import { CTA, CTAWrapper } from '@/components/UI'
import { push } from '@socialgouv/matomo-next'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import shareIcon from '@/public/share.svg'
import Image from 'next/image'

export default function Share() {
  const isMobile = window.innerWidth <= 600
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
    <form
      css={`
        text-align: center;
      `}
    >
      <CTAWrapper
        css={`
          margin: 0;
        `}
      >
        <CTA
          $importance="emptyBackground"
          css={`
            border-radius: 0.5rem;
            padding: 0.5rem;
            align-items: center;
            display: flex;
            flex-direction: column;
            ${copied &&
            `
                border: 1px dashed var(--color);
              `}
            @media (max-width: 600px) {
              width: 100%;
            }
          `}
          $fontSize="normal"
          title="Cliquez pour partager le lien"
          onClick={() => {
            push(['trackEvent', 'Partage', 'Clic'])
            isMobile && navigator.share ? share() : copyToClipboard()
          }}
        >
          <Image src={shareIcon} alt="Icon copier" className="icon" />
          {copied && 'Lien copié'}
        </CTA>
      </CTAWrapper>
    </form>
  )
}
