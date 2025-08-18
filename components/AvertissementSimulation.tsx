import { useEffect, useState } from 'react'
import { Highlight } from '@codegouvfr/react-dsfr/Highlight'

const localStorageKey = 'avertissementSimulationLuLe'

function isMoreThanOneMonthLater(date1, date2) {
  // Parse the dates into Date objects
  const dt1 = new Date(date1)
  const dt2 = new Date(date2)

  // Calculate the difference in months
  const monthDiff =
    (dt2.getFullYear() - dt1.getFullYear()) * 12 +
    (dt2.getMonth() - dt1.getMonth())

  // Check if the difference is more than one month
  return monthDiff > 1
}

function serializeDay(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const useAvertissementState = () => {
  const [open, setOpen] = useState(undefined)

  useEffect(() => {
    const now = new Date()
    const value = localStorage.getItem(localStorageKey)
    if (value != undefined) {
      const readDate = new Date(value)
      if (isMoreThanOneMonthLater(readDate, now)) {
        setOpen(true)
      } else setOpen(false)
    } else {
      setOpen(true)
    }
    localStorage.setItem(localStorageKey, serializeDay(now))
  }, [setOpen])

  return [open, setOpen]
}
export default function AvertissementSimulation({
  avertissementState: open,
  setAvertissementState: setOpen,
}) {
  return (
    <>
      <Highlight
        classes={{
          root: 'fr-highlight--yellow-moutarde fr-mt-5v',
        }}
      >
        <span
          className="fr-icon-money-euro-circle-line"
          aria-hidden="true"
        ></span>{' '}
        Ceci est une <strong>simulation</strong>...{' '}
        {!open ? (
          <button onClick={() => setOpen(true)}>Lire +</button>
        ) : (
          <>
            <br />
            <br />
            L'estimation des aides est indicative : elle est calculée à partir
            des informations que vous avez saisies, et des règles en vigueur au
            moment de la simulation.
            <br />
            Cette simulation <strong>ne vaut pas pour décision</strong>. Elle
            n’engage pas l’Anah, le réseau France Rénov', ou les autres
            organismes financeurs.
            <br />
            Les aides sont susceptibles de changer. Nous mettons à jour le
            simulateur régulièrement.
            <button
              onClick={() => {
                setOpen(false)
              }}
            >
              J'ai compris{' '}
              <span
                style={{
                  transform: 'scaleX(-1) scaleY(1) rotate(90deg)',
                  display: 'inline-block',
                }}
                title="Flèche à coude pointant vers le haut"
              >
                ↵
              </span>
            </button>
          </>
        )}
      </Highlight>
    </>
  )
}
