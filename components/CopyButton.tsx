import { CTA, CTAWrapper } from '@/components/UI'
import { push } from '@socialgouv/matomo-next'
import { useState } from 'react'
import shareIcon from '@/public/share.svg'
import Image from 'next/image'
import Share from '@/app/simulation/Share'
import Button from '@codegouvfr/react-dsfr/Button'

export default function CopyButton() {
  const [open, setOpen] = useState(false)

  return (
    <div
      css={`
        float: right;
      `}
    >
      <Button
        priority="tertiary"
        aria-describedby="tooltip"
        title="Cliquez pour partager le lien"
        onClick={() => {
          push(['trackEvent', 'Partage', 'Clic'])
          setOpen(!open)
        }}
      >
        <Image src={shareIcon} alt="Icon copier" className="icon" />
      </Button>
      <span className="fr-tooltip fr-placement" id="tooltip" role="tooltip">
        <Share />
      </span>
    </div>
  )
}
