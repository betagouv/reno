import { Card, Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import rules from '@/app/règles/rules'
import css from '@/components/css/convertToJs'
import mprImage from '@/public/maprimerenov.svg'
import { categories, getRulesByCategory } from '@/components/utils'
import Image from 'next/image'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import CallOut from '@codegouvfr/react-dsfr/CallOut'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "MaPrimeRénov'",
  description: "Les aides MaPrimeRénov' rénovation par geste.",
}

export default function MaPrimeRenov() {
  const rulesByCategory = getRulesByCategory(rules, 'MPR')
  return (
    <Main>
      <Section>
        <Breadcrumb
          currentPageLabel="MaPrimeRénov' rénovation par geste"
          homeLinkProps={{
            href: '/',
          }}
          segments={[
            {
              label: 'Les aides',
              linkProps: {
                href: '/aides',
              },
            },
          ]}
        />
        <Link
          className="fr-btn fr-btn--secondary fr-icon-arrow-left-line fr-btn--icon-left fr-mb-5v"
          href="/aides"
        >
          Retour à la liste des aides
        </Link>
        <div
          style={css`
            display: flex;
            margin: 1rem 0;
          `}
        >
          <Image src={mprImage} alt="Logo MaPrimeRénov'" width="100" />
          <h1
            style={css`
              margin-left: 1rem;
            `}
          >
            MaPrimeRénov' rénovation par geste
          </h1>
        </div>

        <CallOut
          colorVariant="blue-ecume"
          iconId="fr-icon-information-line"
          title="Informations"
        >
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
        </CallOut>

        <h2>Calculateurs d'aide MaPrimeRénov' rénovation par geste</h2>
        {Object.keys(rulesByCategory).map((category) => (
          <Card key={category}>
            <div
              style={css`
                display: flex;
                align-items: flex-start;
              `}
            >
              <Image
                src={categories.find((c) => c.titre == category).image}
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
                  {rulesByCategory[category].map((rule, index) => (
                    <li
                      style={css`
                        margin: 1rem 0;
                      `}
                      key={index}
                    >
                      <a
                        className="fr-link"
                        href={`/aides/ma-prime-renov/${encodeURIComponent(rules[rule].titre)}`}
                      >
                        {rules[rule].titre}
                      </a>
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
