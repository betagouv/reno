'use client'

import { QuestionHeader } from '@/app/simulation/QuestionHeader'
import styled from 'styled-components'
import Image from 'next/image'
import illustrationAccueil from '@/public/illustration-accueil.resized.jpg'
import logoMPA from '@/public/logo-mpa.png'

export default function AidesGlobales() {
  return (
    <>
      <QuestionHeader>
        <small>Estimer mes aides</small>
        <h3>Quel est votre besoin ?</h3>
        <div
          css={`
            p {
              color: #666;
              font-size: 90%;
              line-height: 1.25rem;
              margin-top: 1rem;
            }
          `}
        >
          <p>
            Si le besoin est multiple alors il faudra réaliser 2 simulations.
            Avant de vous lancer dans des projets de travaux de rénovation,
            contactez le conseiller France Rénov’ le plus proche de chez vous et
            profitez gratuitement de ses conseils personnalisés pour mener à
            bien votre projet.
          </p>
        </div>
      </QuestionHeader>
      <div
        css={`
          display: flex;
          justify-content: space-between;
          gap: 2rem;
          h3 {
            margin: 0 0 1rem 0;
          }
        `}
      >
        <ChoixParcours onClick={() => (window.location.href = '/simulation')}>
          <h3>
            <input type="radio" name="parcours" />
            Rénovation énergétique
          </h3>
          <div>
            <Image
              src={illustrationAccueil}
              alt="Image illustrant la rénovation énergétique"
              width="100"
            />
            <p>
              Réduire ma facture d'énergie ou améliorer le confort de mon
              logement
            </p>
          </div>
        </ChoixParcours>
        <ChoixParcours
          onClick={() => (window.location.href = '/simulation/ma-prime-adapt')}
        >
          <h3>
            <input type="radio" name="parcours" />
            Autonomie de la personne
          </h3>
          <div>
            <Image src={logoMPA} alt="Logo MPA" width="100" />
            <p>
              Adapter mon logement au vieillissement ou à une situation de
              handicap
            </p>
          </div>
        </ChoixParcours>
      </div>
    </>
  )
}

export const ChoixParcours = styled.label`
  cursor: pointer;
  background: #e8edff;
  display: block;
  text-decoration: none;
  border: 2px solid white;
  background: white;
  border: 2px solid #dfdff1;
  border-radius: 0.3rem;
  padding: calc(0.3rem + 0.7vw) calc(0.5rem + 1vw);
  h3 {
    display: flex;
    align-items: center;
    color: var(--color);
    font-size: 130%;
  }
  p {
    color: black;
    font-size: 90%;
  }
  img {
    margin-right: 1rem;
  }
  &:hover {
    border: 2px solid #004396;
  }
  & > div {
    display: flex;
    align-items: center;
  }
  input {
    cursor: pointer;
    margin-right: 0.6rem;
  }
`
