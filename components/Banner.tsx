'use client'
import closeIcon from '@/public/close-line.svg'
import informationIcon from '@/public/information.svg'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useLocalStorage } from 'usehooks-ts'

const ls = 'bannière-guichet-juin-2025'
export default function Banner({}) {
  const [bannerRead, setBannerRead] = useState()

  useEffect(() => {
    const value = localStorage.getItem(ls)
    setBannerRead(value || false)
  }, [setBannerRead, bannerRead])

  if (bannerRead == null) return null
  if (bannerRead) return null
  return (
    <Section>
      <div>
        <header>
          <Image src={informationIcon} alt="infobulle" width="25" />
          <strong>
            23 juin 2025 : le guichet MaPrimeRénov’ parcours accompagné est
            temporairement suspendu
          </strong>
        </header>

        <button
          onClick={() => {
            localStorage.setItem(ls, true)
            setBannerRead(true)
          }}
        >
          <Image src={closeIcon} alt="fermer la bannière" width="25" />
        </button>
        <div>
          <p>
            La réouverture de MaPrimeRénov’ dédiée à la rénovation globale
            individuelle est prévue vers le 15 septembre 2025. Les autres aides
            restent disponibles (travaux par geste, copropriétés). Le simulateur
            sera bientôt mis à jour.
          </p>
        </div>
      </div>
    </Section>
  )
}

const Section = styled.section`
  padding: 1rem 1.2rem;
  position: relative;
  width: 100vw;
  max-width: 100%;
  background: #e8edff;
  color: #0063cb;
  img {
    vertical-align: text-bottom;
    margin-right: 0.4rem;
    display: block;
  }
  header {
    display: flex;
    margin-bottom: 0.6rem;
  }
  strong {
    display: block;
  }
  > div {
    width: 900px;
    max-width: 100%;
    margin: 0 auto;
  }
  button {
    background: none;
    border: none;
    position: absolute;
    right: 0rem;
    top: 1rem;
    img {
      width: 1.4rem;
      height: auto;
    }
  }
`
