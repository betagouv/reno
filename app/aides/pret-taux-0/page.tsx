import { Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import css from '@/components/css/convertToJs'
import rules from '@/app/règles/rules'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import Card from '@codegouvfr/react-dsfr/Card'
import Link from 'next/link'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export const metadata: Metadata = {
  title:
    'Les prêts à taux zéro destinés à la rénovation énergétique en ' +
    new Date().getFullYear(),
  description:
    'Les prêts à taux zéro destinés à la rénovation énergétique en ' +
    new Date().getFullYear() +
    ": L'éco-prêt à taux zéro (éco-PTZ) et le prêt avance rénovation (PAR+)",
}

export default async function Aides() {
  return (
    <>
      <StartDsfrOnHydration />
      <Main>
        <Section>
          <Breadcrumb
            currentPageLabel="Les prêts à taux 0"
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
          <h1>Les prêts à taux 0 pour financer vos travaux de rénovation</h1>
          <p>
            Les prêts à taux zéro sont des moyens avantageux de réaliser vos
            travaux de rénovation. Ils peuvent être sollicités seuls ou en
            complément d'autres dispositifs tels que MaPrimeRénov'.
          </p>
          <p>
            Les deux principaux prêts à taux zéro existants en{' '}
            {new Date().getFullYear()} sont{' '}
            <strong>l'éco-prêt à taux zéro</strong> (éco-PTZ) et le{' '}
            <strong>prêt avance rénovation</strong> (PAR+). Il est{' '}
            <strong>possible de les cumuler</strong> à condition de financer des
            postes de travaux différents.
          </p>
          <p>
            Vous pouvez consulter les fiches correspondantes afin de{' '}
            <strong>tester votre éligibilité</strong> et d'en savoir plus.
          </p>
          <div className="fr-grid-row fr-grid-row--gutters fr-mb-5v">
            <div className="fr-col-12 fr-col-md-4">
              <Card
                background
                border
                desc={
                  <div
                    dangerouslySetInnerHTML={{
                      __html: rules['PTZ'].descriptionHtml,
                    }}
                  />
                }
                enlargeLink
                imageAlt="Logo Eco-PTZ"
                imageUrl="/eco-ptz.png"
                linkProps={{
                  href: '/aides/pret-taux-0/eco-ptz',
                }}
                size="medium"
                title={rules['PTZ'].titre}
                titleAs="h2"
              />
            </div>
            <div className="fr-col-12 fr-col-md-4">
              <Card
                background
                border
                desc={
                  <div
                    dangerouslySetInnerHTML={{
                      __html: rules['PAR'].descriptionHtml,
                    }}
                  />
                }
                enlargeLink
                imageAlt="Logo Prêt Avance Rénovation"
                imageUrl="/par.png"
                linkProps={{
                  href: '/aides/pret-taux-0/pret-avance-renovation',
                }}
                size="medium"
                title={rules['PAR'].titre}
                titleAs="h2"
              />
            </div>
          </div>
          <h3>Les autres dispositifs de prêts</h3>
          <p>
            Il existe d'autres dispositifs de prêt pour financer vos travaux
            avec des conditions d'obtentions différentes:
          </p>
          <ul>
            <li>
              <strong>Le prêt sur le livret Développement durable</strong>{' '}
              couvre les mêmes travaux que MaPrimeRénov' ainsi que les frais
              d'installation.
            </li>
            <li>
              <strong>Le prêt d'accession sociale</strong>: Son obtention dépend
              de vos ressources et de l'endroit où vous habitez.
            </li>
            <li>
              <strong>Le prêt à l'amélioration de l'habitat</strong> si vous
              recevez des allocations de la Caisse d'Allocations Familiales.
            </li>
            <li>
              <strong>Les prêts des distributeurs d'énergie</strong>
            </li>
          </ul>
        </Section>
      </Main>
    </>
  )
}
