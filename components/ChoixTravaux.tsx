'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import React from 'react'
import 'react-tooltip/dist/react-tooltip.css'
import styled from 'styled-components'
import isolationGeste from '@/public/isolation_geste.svg'
import ventilationGeste from '@/public/ventilation_geste.svg'
import chauffageGeste from '@/public/chauffage_geste.svg'
import Image from 'next/image'

export default function ChoixTravaux({
  situation,
  rules,
  engine,
  setSearchParams,
}) {
  const [categorieCochee, setCategorieCochee] = useState({})
  const [gestesCoches, setGestesCoches] = useState({})
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 400,
  )
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  return (
    <>
      <Accordion>
        <section>
          <h3>
            <input
              type="checkbox"
              onChange={() =>
                setCategorieCochee((prev) => ({
                  ...prev,
                  ['isolation']: !prev['isolation'],
                }))
              }
            />
            <span>
              Isolation thermique
              <span className="sousTitre">
                Murs, plancher, toit, portes et fenêtres
              </span>
            </span>
          </h3>
          <Image src={isolationGeste} alt="Icone d'isolation d'une maison" />
        </section>
        <section>
          <h3>
            <input
              type="checkbox"
              onChange={() =>
                setCategorieCochee((prev) => ({
                  ...prev,
                  ['ventilation']: !prev['ventilation'],
                }))
              }
            />
            <span>
              Ventilation
              <span className="sousTitre">VMC</span>
            </span>
          </h3>
          <Image
            src={ventilationGeste}
            alt="Icone représentant la ventilation d'une maison"
          />
        </section>
        <section>
          <h3>
            <input
              type="checkbox"
              onChange={() =>
                setCategorieCochee((prev) => ({
                  ...prev,
                  ['chauffage']: !prev['chauffage'],
                }))
              }
            />
            <span>
              Chauffage et eau chaude
              <span className="sousTitre">
                Pompe à chaleur, poêle, chauffe-eau...
              </span>
            </span>
          </h3>
          <Image
            src={chauffageGeste}
            alt="Icone représentant le chauffage d'une maison"
          />
        </section>
      </Accordion>
      {categorieCochee && categorieCochee['isolation'] && (
        <>
          <h4>Isolation : Quels problèmes constatez-vous ?</h4>
          <Accordion>
            {Object.entries({
              'gestes . isolation . murs':
                'Murs mal isolés ou froids au toucher',
              'gestes . isolation . rampants': 'Toiture ou combles mal isolés',
              'gestes . isolation . toitures terrasses':
                'Toit plat mal isolé, surchauffe en été',
              'gestes . isolation . plancher bas':
                'Sensation de froid venant du sol',
              'gestes . isolation . vitres':
                'Simple vitrage ou fenêtres anciennes',
            }).map((item) => {
              return (
                <section>
                  <h3>
                    <input
                      type="checkbox"
                      onChange={() =>
                        setGestesCoches((prev) => ({
                          ...prev,
                          [item[0]]: !prev[item[0]],
                        }))
                      }
                    />
                    <span>{item[1]}</span>
                  </h3>
                </section>
              )
            })}
          </Accordion>
        </>
      )}
      {categorieCochee && categorieCochee['chauffage'] && (
        <>
          <h4>Chauffages : quelles options vous intéressent ?</h4>
          <Accordion>
            {Object.entries({
              'gestes . chauffage . PAC': 'Pompe à chaleur',
              'gestes . chauffage . bois . chaudière': 'Chaudière',
              'gestes . chauffage . bois': 'Poêles et insert',
              'gestes . chauffage . chauffe-eau thermodynamique': 'Chauffe-eau',
            }).map((item) => {
              return (
                <section>
                  <h3>
                    <input
                      type="checkbox"
                      onChange={() =>
                        setGestesCoches((prev) => ({
                          ...prev,
                          [item[0]]: !prev[item[0]],
                        }))
                      }
                    />
                    <span>{item[1]}</span>
                  </h3>
                </section>
              )
            })}
          </Accordion>
        </>
      )}
    </>
  )
}

const Accordion = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  section {
    display: flex;
    gap: 1rem;
    border: 1px solid #dddddd;
    padding: 1rem;
    > h3 {
      flex-grow: 1;
      font-weight: normal;
      margin: 0;
      font-size: 100%;
      display: flex;
      border-right: 1px solid #dddddd;
      input {
        width: 1.6rem;
        height: 1.6rem;
        margin-right: 1rem;
        margin-left: 1vw;
        cursor: pointer;
      }
      .sousTitre {
        display: block;
        font-weight: normal;
        color: var(--mutedColor);
      }
    }
    img {
      margin-left: auto;
    }
  }
  .estimer {
    font-weight: normal;
    &:hover {
      background: var(--color);
      color: white;
    }
  }
  .slide-down {
    overflow: hidden;
    max-height: 0;
    transition: max-height 1s ease-out;
  }
  .slide-down.active {
    max-height: fit-content;
    background: white;
  }
  section > .slide-down.active {
    padding: 1rem;
  }
  table {
    width: 100%;
    td {
      border: none;
    }
  }
  tr td:first-of-type > img {
    width: 1rem;
    height: auto;
    margin: 0 0.5rem;
  }
  span {
    cursor: pointer;
  }
`
