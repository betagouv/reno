import { PageBlock } from '@/components/UI'
import { Metadata } from 'next/types'
import rules from '@/app/règles/rules'
import Image from 'next/image'
import { categories, getRulesByCategory } from '@/components/utils'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import Link from 'next/link'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import Badge from '@codegouvfr/react-dsfr/Badge'

export const metadata: Metadata = {
  title: "Certificats d'économie d'énergie (CEE)",
  description: "Les aides des fournisseurs d'énergie.",
}

export default function CEE() {
  const rulesByCategory = getRulesByCategory(rules, 'CEE')
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <Breadcrumb
          currentPageLabel="Certificats d'économie d'énergie (CEE)"
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
        <h1>Les Certificats d'économie d'énergie (CEE)</h1>
        <div className="fr-callout fr-icon-info-line">
          <h2>Informations sur les conditions d'obtention</h2>
          <p>
            Vous êtes éligible aux aides des fournisseurs d’énergie (certificats
            d’économies d’énergie – CEE) si :
          </p>
          <ul>
            <li>
              vous êtes <strong>propriétaire ou locataire</strong>
            </li>
            <li>
              le logement a été <strong>construit depuis plus de 2 ans.</strong>
            </li>
            <li>
              il s'agit de votre{' '}
              <strong>résidence principale ou secondaire</strong>.
            </li>
          </ul>
          <p>
            Il n'y a <strong>pas de plafond de ressources à respecter</strong>,
            mais le montant des aides des fournisseurs d’énergie (certificats
            d’économies d’énergie – CEE) peut varier en fonction de vos revenus.
          </p>
        </div>
        <h2>
          Calculateurs d'aide CEE pour la rénovation énergétique des logements
        </h2>
        <div>
          {Object.keys(rulesByCategory).map((category, i) => (
            <div className="fr-callout" key={i}>
              <h3
                className="fr-callout__title"
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
              <div className="fr-callout__text">
                <ul>
                  {rulesByCategory[category].map((rule, index) => (
                    <li key={index}>
                      <a
                        className="fr-link"
                        href={`/aides/cee/${rules[rule].code}/${encodeURIComponent(rules[rule].titre)}`}
                      >
                        {rules[rule].titre}
                      </a>{' '}
                      <Badge noIcon severity="info">
                        {rules[rule].code}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </PageBlock>
    </>
  )
}
