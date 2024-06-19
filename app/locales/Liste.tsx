'use client'
import aides from '@/app/règles/aides-locales.publicodes'
import { Section } from '@/components/UI'
import Image from 'next/image'
import Link from 'next/link'
import { description } from './description'
import PlaceSummary from './PlaceSummary'

const aidesEntries = Object.entries(aides)

const byPlace = aidesEntries.reduce(
  (memo, next) => {
    const dottedName = next[0]
    if (dottedName === '' || dottedName == '0') return memo

    const place = dottedName.split(' . ')[0]

    return { ...memo, [place]: [...(memo[place] || []), next] }
  },
  [{}],
)

export default function () {
  return (
    <div>
      <Section>
        <h1>Les aides locales à la rénovation en France</h1>
        <p>{description}</p>
        <p>
          Sont listées ici les aides financières soutenues par une source
          officielle. Cela peut être une page Web, un PDF sur le site d'une
          collectivité, ou une page ANIL dont la date de vérification est
          récente. Il est de la responsabilité des collectivités de supprimer
          leurs références à des aides obsolètes.
        </p>
        <div
          css={`
            display: flex;
            align-items: center;
            margin-top: 1.4rem;
            img {
              margin-left: 0.3rem;
              margin-right: 1rem;
              height: 2rem;
              width: auto;
            }
          `}
        >
          <Image
            src="/information.svg"
            width="10"
            height="10"
            alt="Icône d'information"
          />{' '}
          <p>
            Cette liste n'est{' '}
            <em css="background: yellow">
              pas encore validée par les collectivités.
            </em>{' '}
            Vous disposez d'informations sourcées sur une aide locale ?{' '}
            <Link href="/faq">Contactez-nous</Link> ! En attendant, la{' '}
            <a href="https://www.anil.org/aides-locales-travaux">
              base de l'ANIL
            </a>{' '}
            est la source la plus complète.
          </p>
        </div>
        <ul
          css={`
            list-style-type: none;
            padding-left: 0;
            margin-top: 4vh;
          `}
        >
          {Object.entries(byPlace).map(([place, placeRules]) => (
            <PlaceSummary {...{ place, placeRules }} />
          ))}
        </ul>
      </Section>
    </div>
  )
}
