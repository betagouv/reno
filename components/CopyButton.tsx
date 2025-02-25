import { CTA, CTAWrapper } from '@/components/UI'
import { push } from '@socialgouv/matomo-next'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import shareIcon from '@/public/share.svg'
import Image from 'next/image'
import Share from '@/app/simulation/Share'

export default function CopyButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
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
            @media (max-width: 600px) {
              width: 100%;
            }
          `}
          $fontSize="normal"
          title="Cliquez pour partager le lien"
          onClick={() => {
            push(['trackEvent', 'Partage', 'Clic'])
            setOpen(!open)
          }}
        >
          <Image src={shareIcon} alt="Icon copier" className="icon" />
        </CTA>
      </CTAWrapper>
      <div
        css={`
          border: 1px solid var(--color); /* Tooltip border */
          padding: 20px 10px;
          position: absolute;
          background: white;
          z-index: 100;
          border-radius: 5px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          min-width: 330px;
          transform: translateX(calc(-110%)) translateY(-50px);
          transition:
            transform 0.5s ease-in-out,
            opacity 0.5s ease-in-out;
          opacity: 0;
          ${open &&
          `opacity: 1;transform: translateX(calc(-102%)) translateY(-50px);`}
          &::after {
            content: '';
            position: absolute;
            top: 15%;
            left: 100%;
            border-width: 7px;
            border-style: solid;
            border-color: transparent transparent transparent var(--color);
          }
        `}
      >
        <button
          onClick={() => setOpen(false)}
          css={`
            position: absolute;
            top: 5px;
            right: 5px;
            background: none;
            border: none;
            cursor: pointer;
            color: #666;
            &:hover {
              color: black;
            }
          `}
        >
          x
        </button>
        <Share />
      </div>
    </>
  )
}
