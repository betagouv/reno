import { push } from '@socialgouv/matomo-next'
import { useState } from 'react'
import Share from '@/app/simulation/Share'
import Button from '@codegouvfr/react-dsfr/Button'

export default function CopyButton() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="fr-share"
      css={`
        float: right;
      `}
    >
      <div className="fr-btns-group">
        <Button
          iconId="fr-btn--copy"
          priority="tertiary"
          // aria-describedby="tooltip"
          title="Cliquez pour partager le lien"
          onClick={() => {
            push(['trackEvent', 'Partage', 'Clic'])
            navigator.clipboard.writeText(window.location).then(function () {
              alert('Adresse copiée dans le presse papier.')
            })
            //setOpen(!open)
          }}
        >
          Copier dans le presse-papier
        </Button>
        <span className="fr-tooltip fr-placement" id="tooltip" role="tooltip">
          <Share />
        </span>
      </div>
    </div>
  )
}
