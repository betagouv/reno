'use client'
import Image from 'next/image'
import hexagoneIcon from '@/public/hexagone-contour.svg'
import { formatValue } from 'publicodes'
import { PrimeStyle } from './UI'

const Hexagone = () => (
  <Image
    src={hexagoneIcon}
    alt="Icône représentant le territoire français métropolitaine"
  />
)
const Header = () => (
  <header
    css={`
      display: flex;
      align-items: center;
      margin-top: 3vh;
      margin-bottom: 1rem;

      h3  {
        margin: 0;
        margin-left: 0.6rem;
      }
    `}
  >
    <Hexagone />
    <h3>Les aides locales</h3>
  </header>
)
export default function AidesLocales({ engine, situation }) {
  const locales = engine
    .setSituation(situation)
    .evaluate('aides locales . angers . aides')

  if (!locales.nodeValue) return null

  const value = formatValue(locales)

  return (
    <section
      css={`
        margin: 1rem 0;
        h4 {
          font-weight: 400;
          margin: 1rem 0px 0.6rem;
          font-size: 120%;
        }
      `}
    >
      <h4
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <strong>+</strong>&nbsp;Métropole d'<strong>Angers</strong>
        <small
          css={`
            margin-left: 0.3rem;
            background: #fdf8db;
            color: #6e4444;
            margin-right: 0.8rem;
            padding: 0 0.6rem;
            display: inline-flex;
            align-items: center;
            border-radius: 0.4rem;
            img {
              margin-right: 0.4rem;
            }
            display: none;
          `}
        >
          <Hexagone /> bonus&nbsp;local
        </small>
      </h4>
      <PrimeStyle>
        jusqu'à <strong>{value}</strong>
      </PrimeStyle>
    </section>
  )
}
