import { CTA, CTAWrapper, Section } from '@/components/UI'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

export default function Share() {
  const pathname = usePathname(),
    searchParams = useSearchParams()

  const [withAnswers, setWithAnswers] = useState(true)
  const [clicked, setClicked] = useState(false)
  const textAreaRef = useRef(null)

  useEffect(() => {
    setClicked(false)
  }, [searchParams])

  const searchParamsString = searchParams.toString()
  const url =
    'https://mesaidesreno.beta.gouv.fr' +
    (withAnswers ? pathname : '') +
    (searchParamsString && withAnswers ? '?' + searchParamsString : '')

  function copyToClipboard(e) {
    textAreaRef.current.select()
    document.execCommand('copy')
    // This is just personal preference.
    // I prefer to not show the the whole text area selected.
    e.target.focus()
    e.preventDefault()
    return null
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
              ${clicked &&
              `
                background: #BEF2C53;
                border: 1px dashed var(--validColor);
              `}
            `}
            $fontSize="normal"
            title="Cliquez pour partager le lien"
            onClick={() => {
              navigator.share
                ? navigator
                    .share({
                      text: 'Voici ma simulation Mes Aides Réno',
                      url,
                      title: 'Mes aides réno',
                    })
                    .then(() => setClicked(true))
                    .catch((error) => console.log('Error sharing', error))
                : copyToClipboard
            }}
          >
            <span
              css={`
                ${clicked && 'color: var(--validColor) !important;'}
              `}
            >
              {!clicked ? '🔗 Copier le lien' : '✔ Lien copié'}
            </span>
          </CTA>
        </CTAWrapper>
        {!navigator.share && (
          <input
            css={`
              vertical-align: middle;
              box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075);
              border-radius: 0.3rem;
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
              border: 1px solid var(--color);
              padding: 0.2rem 0.4rem;
              width: 60%;
              background: transparent;
              height: 1.6rem;
            `}
            readOnly
            ref={textAreaRef}
            value={url}
          />
        )}
        {searchParamsString && (
          <div>
            <input
              type="checkbox"
              id="withAnswers"
              name="withAnswers"
              checked={withAnswers}
              onChange={() => setWithAnswers(!withAnswers)}
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
