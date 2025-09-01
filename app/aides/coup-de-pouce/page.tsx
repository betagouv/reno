import { PageBlock } from '@/components/UI'
import { Metadata } from 'next/types'
import rules from '@/app/règles/rules'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import Link from 'next/link'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export const metadata: Metadata = {
  title: 'Aide "Coup de Pouce" Chauffage',
  description: `Les aides des fournisseurs d'énergie pour le "Coup de Pouce" Chauffage.`,
}

export default function CoupDePouce() {
  const distinctRulesCoupDePouce = Object.keys(rules)
    .filter(
      (item) => item.startsWith('gestes') && item.endsWith('Coup de pouce'),
    )
    .map((item) => item.replace(' . Coup de pouce', ''))

  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <Breadcrumb
          currentPageLabel="Coup de Pouce Chauffage"
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
        <h1>"Coup de Pouce" chauffage</h1>
        <div className="fr-callout fr-icon-info-line">
          <h2>Informations</h2>
          <p>Vous êtes éligible à cette aide si:</p>
          <ul>
            <li>
              vous êtes <strong>propriétaire ou locataire</strong> d'une{' '}
              <strong>résidence principale ou secondaire</strong>.
            </li>
            <li>
              le logement a été <strong>construit depuis plus de 2 ans.</strong>
            </li>
            <li>
              vous remplacez une chaudière individuelle{' '}
              <strong>au charbon, au fioul ou au gaz</strong>
            </li>
          </ul>
          <p>
            Il n'y a <strong>pas de plafond de ressources à respecter</strong>,
            mais le montant de l'aide "Coup de Pouce" varie en fonction de vos
            revenus.
          </p>
          <p>
            Ce dispositif est cumulable avec{' '}
            <a
              className="fr-link"
              href="/aides/ma-prime-renov"
              title="Liste des aides MaPrimeRénov'"
            >
              MaPrimeRénov' rénovation par geste
            </a>{' '}
            et{' '}
            <a
              className="fr-link"
              href="/aides/pret-taux-0/eco-ptz"
              title="L'éco-ptz"
            >
              l’éco-prêt à taux zéro
            </a>
            . En revanche, il n'est pas cumulable avec{' '}
            <a
              className="fr-link"
              href="/aides/cee"
              title="Liste des aides CEE"
            >
              les aides des fournisseurs d’énergie (certificats d’économies
              d’énergie – CEE)
            </a>
          </p>
        </div>
        <h2>Calculateurs des aides "Coup de pouce Chauffage"</h2>
        <div className="fr-callout">
          <ul>
            {distinctRulesCoupDePouce.map((rule, index) => (
              <li key={index}>
                <a
                  className="fr-link"
                  href={`/aides/coup-de-pouce/${encodeURIComponent(rules[rule].titre)}`}
                >
                  Remplacement d'une chaudière par{' '}
                  <strong>{rules[rule].titre}</strong>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </PageBlock>
    </>
  )
}
