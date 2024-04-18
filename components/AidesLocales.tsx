'use client'
import Image from 'next/image'
import hexagoneIcon from '@/public/hexagone-contour.svg'
import { formatValue } from 'publicodes'

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
          <p>Nous n'avons pas trouvé d'aides locales pour vous.</p>
        </Header>
      </section>
    )

  const value = formatValue(locales)

  return (
    <section>
      <Header />
      <p>Angers : jusqu'à {value}</p>
      <p>
        Cette liste est non exhaustive et les montants ne sont pas encore
        validés.
      </p>
    </section>
  )
}
