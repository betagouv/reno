import { PageBlock } from '@/components/UI'
import { Metadata } from 'next/types'
import rules from '@/app/règles/rules'
import css from '@/components/css/convertToJs'
import { categories, getRulesByCategory } from '@/components/utils'
import Image from 'next/image'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import Link from 'next/link'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export const metadata: Metadata = {
  title: "MaPrimeRénov'",
  description: "Les aides MaPrimeRénov' rénovation par geste.",
}

export default function MaPrimeRenov() {
  const rulesByCategory = getRulesByCategory(rules, 'MPR')
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
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
        <h1>MaPrimeRénov' rénovation par geste</h1>
        <div className="fr-callout fr-icon-info-line">
          <h2>Informations</h2>
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
        </div>

        <h2>Calculateurs d'aide MaPrimeRénov' rénovation par geste</h2>
        {Object.keys(rulesByCategory).map((category) => (
          <div className="fr-callout" key={category}>
            <h3
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <Image
                src={categories.find((c) => c.titre == category).image}
                alt={`icone ${category}`}
                width="30"
              />
              {category}
            </h3>
            <ul>
              {rulesByCategory[category].map((rule, index) => (
                <li key={index}>
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
        ))}
      </PageBlock>
    </>
  )
}
