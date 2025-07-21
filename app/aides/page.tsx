import { PageBlock } from '@/components/UI'
import { Metadata } from 'next/types'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import Card from '@codegouvfr/react-dsfr/Card'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export const metadata: Metadata = {
  title: 'Les aides à la rénovation énergétique en ' + new Date().getFullYear(),
  description:
    'Les aides à la rénovation énergétique en ' +
    new Date().getFullYear() +
    `: MaPrimeRénov', Mon Accompagnateur Rénov', aides des fournisseurs d'énergie (CEE), prime "Coup de Pouce" chauffage, éco-prêt à taux zéro, exonération de taxe foncière et dispositif Denormandie.`,
}

export default function Aides() {
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <Breadcrumb
          currentPageLabel="Les aides"
          homeLinkProps={{
            href: '/',
          }}
          segments={[]}
        />
        <h1>
          Les principaux dispositifs d'aides à la rénovation énergétique en{' '}
          {new Date().getFullYear()}
        </h1>
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12 fr-col-sm-6 fr-col-md-4">
            <Card
              background
              border
              desc={
                <>
                  Le parcours accompagné est{' '}
                  <strong>accessible pour tous</strong>, il vise à encourager
                  des <strong>rénovations d'ampleur</strong>.
                  <br />
                  Les sommes sont importantes et vous êtes{' '}
                  <strong>accompagné par un professionnel agréé</strong>.
                </>
              }
              enlargeLink
              imageAlt="Logo MaPrimeRénov"
              imageUrl="/maprimerenov.svg"
              linkProps={{
                href: '/simulation',
              }}
              size="medium"
              title="MaPrimeRénov' parcours accompagné"
              titleAs="h2"
            />
          </div>
          <div className="fr-col-12 fr-col-sm-6 fr-col-md-4">
            <Card
              background
              border
              desc={
                <>
                  Le parcours par geste est{' '}
                  <strong>accessible sous condition de revenus</strong>.
                  <br />
                  Les travaux de rénovation effectués par{' '}
                  <strong>des professionnels agréés RGE</strong> (pompe à
                  chaleur, poêle à granulés, isolation...).
                </>
              }
              enlargeLink
              imageAlt="Logo MaPrimeRénov"
              imageUrl="/maprimerenov.svg"
              linkProps={{
                href: '/aides/ma-prime-renov',
              }}
              size="medium"
              title="MaPrimeRénov' rénovation par geste"
              titleAs="h2"
            />
          </div>
          <div className="fr-col-12 fr-col-sm-6 fr-col-md-4">
            <Card
              background
              border
              desc={
                <>
                  <strong>L'éco-prêt à taux zéro</strong> (ou éco-PTZ) ainsi que
                  le <strong>prêt avance rénovation</strong> (PAR+) sont
                  accessibles <strong>sans condition de ressources</strong>
                  <br />
                  Ces dispositifs visent à financer des travaux de rénovation
                  énergétique des logements.
                </>
              }
              enlargeLink
              imageAlt="Logo Eco-ptz"
              imageUrl="/ptz-bleu.svg"
              linkProps={{
                href: '/aides/pret-taux-0',
              }}
              size="medium"
              title="Les prêts à taux 0"
              titleAs="h2"
            />
          </div>
          <div className="fr-col-12 fr-col-sm-6 fr-col-md-4">
            <Card
              background
              border
              desc={
                <>
                  Les collectivités locales peuvent proposer une{' '}
                  <strong>exonération de taxe foncière</strong> pour certains
                  logements rénovés.
                  <br />
                  Le <strong>dispositif Denormandie</strong> s'adresse quant à
                  lui au propriétaire bailleur. Il a été prolongé jusqu'au 31
                  décembre 2027.
                </>
              }
              enlargeLink
              imageAlt="Logo Exonération Fiscale"
              imageUrl="/exoneration-fiscale.svg"
              linkProps={{
                href: '/aides/exoneration-fiscale',
              }}
              size="medium"
              title="Les exonérations fiscales"
              titleAs="h2"
            />
          </div>
          <div className="fr-col-12 fr-col-sm-6 fr-col-md-4">
            <Card
              background
              border
              desc={
                <>
                  Le dispositif des certificats d’économies d’énergie (CEE) est{' '}
                  <strong>accessible pour tous</strong>.
                  <br />
                  Des fournisseurs d'énergie proposent des aides pour rénover
                  votre logement.
                  <br />
                  Il s'agit d'une{' '}
                  <strong>obligation encadrée par l’État</strong>.
                </>
              }
              enlargeLink
              imageAlt="Logo CEE"
              imageUrl="/cee.svg"
              linkProps={{
                href: '/aides/cee',
              }}
              size="medium"
              title="Les aides des fournisseurs d’énergie (CEE)"
              titleAs="h2"
            />
          </div>
          <div className="fr-col-12 fr-col-sm-6 fr-col-md-4">
            <Card
              background
              border
              desc={
                <>
                  Les primes dites <em>"Coup de pouce"</em> sont{' '}
                  <strong>accessibles à tous les ménages.</strong>
                  <br />
                  Ils financent le{' '}
                  <strong>
                    remplacement d'un mode de chauffage polluant
                  </strong>{' '}
                  (chaudière au charbon, au fioul ou au gaz) par une
                  installation moins énergivore.
                </>
              }
              enlargeLink
              imageAlt="Logo Coup de pouce"
              imageUrl="/cee-coup-de-pouce.svg"
              linkProps={{
                href: '/aides/coup-de-pouce',
              }}
              size="medium"
              title="Les primes Coup de Pouce Chauffage"
              titleAs="h2"
            />
          </div>
        </div>
      </PageBlock>
    </>
  )
}
