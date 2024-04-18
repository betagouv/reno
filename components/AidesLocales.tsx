'use client'
import Image from 'next/image'
import hexagoneIcon from '@/public/hexagone-contour.svg'
import { formatValue } from 'publicodes'
import { PrimeStyle } from './Geste'

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
  const locales = engine.setSituation(situation).evaluate('aides locales')

  if (!locales.nodeValue)
    return (
      <section>
        <Header>
          <p>[dev] Nous n'avons pas trouvé d'aides locales pour vous.</p>
        </Header>
      </section>
    )

  const value = formatValue(locales)

  return (
    <section
      css={`
        margin: 1rem 0;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <small
          css={`
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
          `}
        >
          <Hexagone /> bonus&nbsp;<strong>Angers</strong>
        </small>
        <PrimeStyle>
          jusqu'à <strong>{value}</strong>
        </PrimeStyle>
      </div>
    </section>
  )
}
