import { Card, InternalLink, Main, MiseEnAvant, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import rules from '@/app/règles/rules'
import css from '@/components/css/convertToJs'
import mprImage from '@/public/maprimerenov.svg'
import { categoriesGeste, getRulesByCategory } from '@/components/utils'
import Image from 'next/image'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata: Metadata = {
  title: "MaPrimeRénov'",
  description: "Les aides MaPrimeRénov' rénovation par geste.",
}

export default function MaPrimeRenov() {
  return (
    <Main>
      <Section>
        <Breadcrumb
          links={[
            { 'Les aides': '/aides' },
            { "MaPrimeRénov' rénovation par geste": '/aides/ma-prime-renov' },
          ]}
        />
        <div
          style={css`
            display: flex;
            margin: 1rem 0;
          `}
        >
          <Image src={mprImage} alt="Logo MaPrimeRénov'" width="100" />
          <h2
            style={css`
              margin-left: 1rem;
            `}
          >
            MaPrimeRénov' rénovation par geste
          </h2>
        </div>
        <MiseEnAvant>
          <h3
            style={css`
              color: #0063cb;
            `}
          >
            Informations
          </h3>
          <p>
            Vous êtes éligible à l'aide MaPrimeRénov' rénovation par geste si :
          </p>
          <ul>
            <li>
              vous êtes <strong>propriétaire (occupant ou bailleur)</strong>
            </li>
            <li>
              le logement a été <strong>construit depuis plus de 15 ans</strong>
            </li>
            <li>
              le logement est{' '}
              <strong>occupé à titre de résidence principale</strong>
            </li>
            <li>
              votre revenu fiscal de référence est inférieur à un certain
              montant
            </li>
          </ul>
          <p
            style={css`
              margin: 1rem 0;
            `}
          >
            Il existe un dispositif nommé{' '}
            <strong>MaPrimeRénov' parcours accompagné</strong> pour une
            rénovation d'ampleur.
          </p>
        </MiseEnAvant>

        <h3>Calculateurs d'aide MaPrimeRénov' rénovation par geste</h3>
        {Object.keys(getRulesByCategory(rules)).map((category) => (
          <Card>
            <div
              style={css`
                display: flex;
                align-items: flex-start;
              `}
            >
              <Image
                src={categoriesGeste.find((c) => c.titre == category).icone}
                alt={`icone ${category}`}
                width="60"
              />
              <div>
                <h3
                  style={css`
                    margin-top: 1rem;
                    padding-left: 1.6rem;
                  `}
                >
                  {category}
                </h3>
                <ul
                  style={css`
                    list-style-position: inside;
                  `}
                >
                  {getRulesByCategory(rules)[category].map((rule, index) => (
                    <li
                      style={css`
                        margin: 1rem 0;
                      `}
                      key={index}
                    >
                      <InternalLink
                        href={`/aides/ma-prime-renov/${encodeURIComponent(rules[rule].titre)}`}
                      >
                        {rules[rule].titre}
                      </InternalLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </Section>
    </Main>
  )
}
