import { useCallback, useState } from 'react'
import styled from 'styled-components'

export default function AvertissementSimulation() {
  const [open, setOpen] = useState(true)
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

const Euro = styled.span`
  border: 1px solid black;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 1rem;
  display: inline-block;
  line-height: 1rem;
  text-align: center;
  font-size: 85%;
  vertical-align: text-top;
  margin-right: 0.2rem;
`

const Section = styled.section`
  margin: 0.6rem auto 1rem;
  width: calc(800px - 2rem);
  max-width: calc(100% - 2rem);
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
      font-size: 85%;
    }
  }

  button {
    margin-top: 1rem;
    background: none;
    border: none;
    color: var(--color);
    margin-bottom: 0.6rem;
    font-size: 110%;
  }
`
