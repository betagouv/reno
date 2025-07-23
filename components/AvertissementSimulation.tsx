import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import euroIcon from '@/public/euro-entouré.svg'

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
  const preventSummaryClick = useCallback((event) => {
    event.preventDefault()
  }, [])

  return (
    <Section>
      <details open={open}>
        <summary
          onClick={(e) => {
            preventSummaryClick(e)
            setOpen(true)
          }}
        >
          <div>
            <Euro title="Symbole euro entouré">€</Euro> Ceci est une{' '}
            <strong>simulation</strong>...
          </div>
          {!open && <button>Lire +</button>}
        </summary>
        <div>
          <p>
            L'estimation des aides est indicative : elle est calculée à partir
            des informations que vous avez saisies, et des règles en vigueur au
            moment de la simulation.
          </p>
          <p>
            Cette simulation <strong>ne vaut pas pour décision</strong>. Elle
            n’engage pas l’Anah, le réseau France Rénov', ou les autres
            organismes financeurs.
          </p>
          <p>
            Les aides sont susceptibles de changer. Nous mettons à jour le
            simulateur régulièrement.
          </p>
          {open && (
            <button onClick={() => setOpen(false)}>
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
          )}
        </div>
      </details>
    </Section>
  )
}
const Euro = () => (
  <Image
    src={euroIcon}
    alt="icone euro"
    css={`
      width: 1.25rem;
      vertical-align: sub;
      height: auto;
    `}
  />
)

const Section = styled.section`
  margin: 0.6rem auto 1rem;
  background: #feecc2;
  border: 1px solid #c8a519;
  padding: 0.6rem 1rem;
  details {
    summary {
      list-style-type: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    > div {
      margin-top: 1rem;
      font-size: 90%;
    }
  }

  button {
    margin: 0.5rem 0;
    background: none;
    border: none;
    color: var(--color);
    font-size: 110%;
    @media (max-width: 800px) {
      margin: 0;
    }
  }
`
