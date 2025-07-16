'use client'
import { push } from '@socialgouv/matomo-next'
import MarSearch from '@/app/trouver-accompagnateur-renov/MarSearch'
import { useState } from 'react'
import Button from '@codegouvfr/react-dsfr/Button'

export default function BlocConseiller({ situation }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button
        iconId="fr-icon-arrow-right-line"
        iconPosition="right"
        onClick={() => {
          setIsOpen((prev) => !prev)
          push([
            'trackEvent',
            'Simulateur Principal',
            'Clic',
            'trouver conseiller',
          ])
        }}
      >
        Prendre rdv avec un conseiller
      </Button>
      {isOpen && (
        <MarSearch situation={situation} what={'trouver-conseiller-renov'} />
      )}
    </>
  )
}
